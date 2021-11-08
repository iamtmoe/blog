---
date: 1970-01-01
tags: 
  - rails
---

# rails启动分析（续）

上一篇讲的不清楚，这篇接着絮叨絮叨。

首先rack提供了一个连接web server和 web应用的接口, web server需要有对应的rack handler，每个handler需要定义一个run方法，这个方法接受app为第一个参数，options为第二个参数。比如puma

```ruby
# puma-4.3.5/lib/rack/handler/puma.rb
module Rack
  module Handler
    module Puma
      def self.run(app, options = {})
        launcher = ::Puma::Launcher.new
        yield launcher if block_given?
        launcher.run
      end
    end
    register :puma, Puma
  end
end
# options 例子
{:environment=>"development", :pid=>nil, :Port=>9292,
:Host=>"localhost", :AccessLog=>[], 
:config=>"/Users/yanjinkai/Desktop/learn_rails/config.ru"}
#内置handler有这些：
{"cgi"=>"Rack::Handler::CGI", "fastcgi"=>"Rack::Handler::FastCGI",
"webrick"=>"Rack::Handler::WEBrick", "lsws"=>"Rack::Handler::LSWS",
"scgi"=>"Rack::Handler::SCGI", "thin"=>"Rack::Handler::Thin"}
```

这里因为puma不是rack内置的handler,所以需要调用Rack::Handler.register

rack要求app是能响应call方法的对象，call方法接收一个env哈希参数，返回一个数组[status,header,body],要求body能响应each方法并每次yield一个字符串。

```ruby
# railties-6.0.3.1/lib/rails/engine.rb
def call(env)
  req = build_request env
  app.call req.env
end
# actionpack-6.0.3.1/lib/action_dispatch/routing/route_set.rb
def call(env)
  req = make_request(env)
  req.path_info = Journey::Router::Utils.normalize_path(req.path_info)
  @router.serve(req)
end
# actionpack-6.0.3.1/lib/action_dispatch/journey/router.rb
def serve(req)
  return [status, headers, body]
end
```

可以看到，rails应用本质就是一个rack应用

rails 可以通过rails server启动，也可以通过rackup启动，都是通过eval config.ru, 最终都是调用了Rack::Handler::Puma.run, 通过rails server启动多做了一些事

```ruby
# railties-6.0.3.1/lib/rails/commands/server/server_command.rb
def start(after_stop_callback = nil)
  trap(:INT) { exit }
  create_tmp_directories
  setup_dev_caching
  log_to_stdout if options[:log_stdout]
  super
end
```

rails应用一共有三个中间件来源，按顺序依次是

1. Rails.application.initialize!

    使用初始化对象build_middleware_stack，首先是默认的ActionDispatch::MiddlewareStack，有二十多个中间件，然后通过Rails::Configuration::MiddlewareStackProxy支持配置中间件，最后把中间件包裹到终端app（Journey router)

    ```ruby
    # railties-6.0.3.1/lib/rails/engine.rb
    def app
      @app || @app_build_lock.synchronize {
        @app ||= begin
          stack = default_middleware_stack
          config.middleware = build_middleware.merge_into(stack)
          config.middleware.build(endpoint)
        end
      }
    end
    # railties-6.0.3.1/lib/rails/railtie/configuration.rb
    def app_middleware
      @@app_middleware ||= Rails::Configuration::MiddlewareStackProxy.new
    end
    ```

2. builder.to_app, 包裹我们在config.ru里使用use注册的中间件

    ```ruby
    # rack-2.2.2/lib/rack/builder.rb
    def to_app
        app = @map ? generate_map(@run, @map) : @run
        fail "missing run or map statement" unless app
        app.freeze if @freeze_app
        app = @use.reverse.inject(app) { |a, e| e[a].tap { |x| x.freeze if @freeze_app } }
        @warmup.call(app) if @warmup
        app
      end
    ```

3. wrapped_app, rack 内置的中间件

    ```ruby
    # rack-2.2.2/lib/rack/server.rb
    def build_app(app)
      middleware[options[:environment]].reverse_each do |middleware|
        middleware = middleware.call(self) if middleware.respond_to?(:call)
        next unless middleware
        klass, *args = middleware
        app = klass.new(app, *args)
      end
      app
    end
    def default_middleware_by_environment
      m = Hash.new {|h, k| h[k] = []}
      m["deployment"] = [
        [Rack::ContentLength],
        logging_middleware,
        [Rack::TempfileReaper]
      ]
      m["development"] = [
        [Rack::ContentLength],
        logging_middleware,
        [Rack::ShowExceptions],
        [Rack::Lint],
        [Rack::TempfileReaper]
      ]
      m
    end
    ```

eval config.ru -> require 'config/evironment' -> require 'application'，我们来看下application.rb内发生了什么

```ruby
# /Users/yanjinkai/Desktop/learn_rails/config/application.rb
require_relative 'boot'
    require 'bundler/setup' # Set up gems listed in the Gemfile.
    require 'bootsnap/setup' # Speed up boot time by caching expensive operations
require 'rails/all' # 加载action_view、active_record等组件
Bundler.require(*Rails.groups) # 加载gem,如果gem中有byebug，那么这行这行之后就可以byebug调试了
module LearnRails
  class Application < Rails::Application
  end
end
# railties-6.0.3.1/lib/rails/application.rb
class << self
  def inherited(base)
    super
    Rails.app_class = base
    add_lib_to_load_path!(find_root(base.called_from))
  end
end
# railties-6.0.3.1/lib/rails.rb
class << self
  def application
    @application ||= (app_class.instance if app_class)
  end
end
```

可见当我们定义LearnRails::Application继承Rails::Application的时候，Rails.application指向了我们的应用，并且将应用根目录lib目录加到$LOAD_PATH

参考：<http://rubylearning.com/blog/2013/04/02/whats-rack/>
