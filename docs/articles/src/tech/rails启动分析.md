---
date: 1970-01-01
tags: 
  - rails
---

# rails启动分析

对于像rails这样的庞然大物，采用逐个阅读文件的方式学习显然是不现实的, 但是代码是死的，运行起来的程序是活的，所以跟随程序的运行去动态的分析能更快地抓住主要的脉络, 如果遇到难懂的代码，就打个断点，查看下环境binding，而且现在的调试工具（比如`byebug`）支持在隔离的环境中测试运行。

读rails源码找方法是基本操作：一般先找`def`定义，如没有则找`attr_reader/attr_accessor`，再没有找`delegate`，按这三步依次在祖先链上查找。

我们从命令行敲下`rails server`开始（这里假设你已经用`rails new <app_name>`生成了一个项目），分析rails的启动流程。

首先奉上辛苦整理的调用栈。大体的流程为：执行可执行文件（rails）-> 根据命令行参数（server）执行对应的perform函数 -> 找到web server(puma) -> 构建app -> 启动server

```ruby
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/bin/rails
load Gem.activate_bin_path('railties', 'rails', version)
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/exe/rails
require "rails/cli"
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/cli.rb
require "rails/app_loader"
Rails::AppLoader.exec_app
    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/app_loader.rb
    def exec_app
      exec RUBY, exe, *ARGV
    end

# /Users/yanjinkai/Desktop/learn_rails/bin/rails
APP_PATH = File.expand_path('../config/application', __dir__)
require_relative '../config/boot'
    # /Users/yanjinkai/Desktop/learn_rails/config/boot.rb
    ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)
    require 'bundler/setup' # Set up gems listed in the Gemfile.
    require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
require 'rails/commands'
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/commands.rb
require "rails/command"
Rails::Command.invoke command, ARGV
  # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/command.rb
  def invoke(full_namespace, args = [], **config)
    command.perform(command_name, args, config)
      # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/commands/server/server_command.rb
      def perform
        extract_environment_option_from_argument
        set_application_directory!
        prepare_restart
        Rails::Server.new(server_options).tap do |server|
          # Require application after server sets environment to propagate
          # the --environment option.
          require APP_PATH
          Dir.chdir(Rails.application.root)

          if server.serveable?
              def serveable? # :nodoc:
                server
                    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/server.rb
                    def server
                      @_server ||= Rack::Handler.get(options[:server])

                      unless @_server
                        @_server = Rack::Handler.default
                            # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/handler.rb
                            def self.default
                              # Guess.
                              if ENV.include?("PHP_FCGI_CHILDREN")
                                Rack::Handler::FastCGI
                              elsif ENV.include?(REQUEST_METHOD)
                                Rack::Handler::CGI
                              elsif ENV.include?("RACK_HANDLER")
                                self.get(ENV["RACK_HANDLER"])
                              else
                                pick SERVER_NAMES
                                def self.pick(server_names)
                                  server_names = Array(server_names)
                                  server_names.each do |server_name|
                                    begin
                                      return get(server_name.to_s)
                                          def self.get(server)
                                            return unless server
                                            server = server.to_s

                                            unless @handlers.include? server
                                              load_error = try_require('rack/handler', server)
                                                  def self.try_require(prefix, const_name)
                                                    file = const_name.gsub(/^[A-Z]+/) { |pre| pre.downcase }.
                                                      gsub(/[A-Z]+[^A-Z]/, '_\&').downcase

                                                    require(::File.join(prefix, file))
                                                        # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/puma-4.3.5/lib/rack/handler/puma.rb
                                                        register :puma, Puma
                                                            # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/handler.rb
                                                            def self.register(server, klass)
                                                              @handlers ||= {}
                                                              @handlers[server.to_s] = klass.to_s
                                                            end
                                                    nil
                                                  rescue LoadError => error
                                                    error
                                                  end
                                            end

                                            if klass = @handlers[server]
                                              const_get(klass)
                                            else
                                              const_get(server, false)
                                            end

                                          rescue NameError => name_error
                                            raise load_error || name_error
                                          end
                                    rescue LoadError, NameError
                                    end
                                  end

                                  raise LoadError, "Couldn't find handler for: #{server_names.join(', ')}."
                                end

                              end
                            end
                        # We already speak FastCGI
                        @ignore_options = [:File, :Port] if @_server.to_s == 'Rack::Handler::FastCGI'
                      end

                      @_server
                    end
                true
              rescue LoadError, NameError
                false
              end
            print_boot_information(server.server, server.served_url)
            after_stop_callback = -> { say "Exiting" unless options[:daemon] }
            server.start(after_stop_callback)
                def start(after_stop_callback = nil)
                  trap(:INT) { exit }
                  create_tmp_directories
                  setup_dev_caching
                  log_to_stdout if options[:log_stdout]
                      def log_to_stdout
                        wrapped_app # touch the app so the logger is set up
                            # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/server.rb
                            def wrapped_app
                              @wrapped_app ||= build_app app
                            end
                            def app
                              @app ||= options[:builder] ? build_app_from_string : build_app_and_options_from_config
                                  def build_app_and_options_from_config
                                    app, options = Rack::Builder.parse_file(self.options[:config], opt_parser)
                                        # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/builder.rb
                                        def self.parse_file(config, opts = Server::Options.new)
                                          return self.load_file(config, opts)
                                              def self.load_file(path, opts = Server::Options.new)
                                                app = new_from_string cfgfile, path
                                                    def self.new_from_string(builder_script, file = "(rackup)")
                                                      # We want to build a variant of TOPLEVEL_BINDING with self as a Rack::Builder instance.
                                                      # We cannot use instance_eval(String) as that would resolve constants differently.
                                                      binding, builder = TOPLEVEL_BINDING.eval('Rack::Builder.new.instance_eval { [binding, self] }')
                                                      eval builder_script, binding, file
                                                          # /Users/yanjinkai/Desktop/learn_rails/config.ru
                                                          # This file is used by Rack-based servers to start the application.
                                                          require_relative 'config/environment'
                                                              # /Users/yanjinkai/Desktop/learn_rails/config/environment.rb
                                                              require_relative 'application'
                                                                  # /Users/yanjinkai/Desktop/learn_rails/config/application.rb
                                                                  require_relative 'boot'
                                                                  require 'rails/all'
                                                                      # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/all.rb
                                                                      require "rails"
                                                                          # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails.rb
                                                                          require 'rails/appliction'

                                                                      %w(
                                                                        active_record/railtie
                                                                        active_storage/engine
                                                                        action_controller/railtie
                                                                        action_view/railtie
                                                                        action_mailer/railtie
                                                                        active_job/railtie
                                                                        action_cable/engine
                                                                        action_mailbox/engine
                                                                        action_text/engine
                                                                        rails/test_unit/railtie
                                                                        sprockets/railtie
                                                                      ).each do |railtie|
                                                                        begin
                                                                          require railtie
                                                                        rescue LoadError
                                                                        end
                                                                      end
                                                                  
                                                                  Bundler.require(*Rails.groups)
                                                                  module LearnRails
                                                                    class Application < Rails::Application
                                                                      config.load_defaults 6.0
                                                                    end
                                                                  end
                                                              Rails.application.initialize!
                                                          run Rails.application
                                                              # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/builder.rb
                                                              def run(app)
                                                                @run = app
                                                              end
                                                      builder.to_app
                                                          # Return the Rack application generated by this instance.
                                                          def to_app
                                                            app = @map ? generate_map(@run, @map) : @run
                                                            fail "missing run or map statement" unless app
                                                            app.freeze if @freeze_app
                                                            app = @use.reverse.inject(app) { |a, e| e[a].tap { |x| x.freeze if @freeze_app } }
                                                            @warmup.call(app) if @warmup
                                                            app
                                                          end
                                                    end
                                              end
                                        end
                                  end
                            end
                            def build_app(app)
                              middleware[options[:environment]].reverse_each do |middleware|
                                middleware = middleware.call(self) if middleware.respond_to?(:call)
                                next unless middleware
                                klass, *args = middleware
                                app = klass.new(app, *args)
                              end
                              app
                            end
                        console = ActiveSupport::Logger.new(STDOUT)
                        console.formatter = Rails.logger.formatter
                        console.level = Rails.logger.level

                        unless ActiveSupport::Logger.logger_outputs_to?(Rails.logger, STDOUT)
                          Rails.logger.extend(ActiveSupport::Logger.broadcast(console))
                        end
                      end

                  super()
                      # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/server.rb
                      def start
                        server.run(wrapped_app, **options, &block)
                            def server
                              @_server ||= Rack::Handler.get(options[:server])
                            end
                            def wrapped_app
                              @wrapped_app ||= build_app app
                            end
                            # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/puma-4.3.5/lib/rack/handler/puma.rb
                            def self.run(app, options = {})
                              conf   = self.config(app, options)
                              events = options.delete(:Silent) ? ::Puma::Events.strings : ::Puma::Events.stdio
                              launcher = ::Puma::Launcher.new(conf, :events => events)
                              yield launcher if block_given?
                              begin
                                launcher.run
                                    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/puma-4.3.5/lib/puma/launcher.rb
                                    # Run the server. This blocks until the server is stopped
                                    def run
                                      setup_signals
                                      set_process_title
                                      @runner.run
                                          def initialize
                                            if clustered?
                                              @options[:logger] = @events
                                      
                                              @runner = Cluster.new(self, @events)
                                            else
                                              @runner = Single.new(self, @events)
                                            end
                                          end
                                          # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/puma-4.3.5/lib/puma/single.rb
                                          def run
                                            @server = server = start_server
                                                def start_server
                                                  min_t = @options[:min_threads]
                                                  max_t = @options[:max_threads]
                                            
                                                  server = Puma::Server.new app, @launcher.events, @options
                                                  server.min_threads = min_t
                                                  server.max_threads = max_t
                                                  server.inherit_binder @launcher.binder
                                                  server
                                                end
                                            server.run.join
                                                # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/puma-4.3.5/lib/puma/server.rb
                                                def run(background=true)
                                                  if background
                                                    @thread = Thread.new do
                                                      Puma.set_thread_name "server"
                                                      handle_servers
                                                          def handle_servers
                                                            while @status == :run
                                                              begin
                                                                ios = IO.select sockets
                                                                ios.first.each do |sock|
                                                                  if sock == check
                                                                    break if handle_check
                                                                  else
                                                                    begin
                                                                      if io = sock.accept_nonblock
                                                                        client = Client.new io, @binder.env(sock)
                                                                        if remote_addr_value
                                                                          client.peerip = remote_addr_value
                                                                        elsif remote_addr_header
                                                                          client.remote_addr_header = remote_addr_header
                                                                        end
                                                    
                                                                        pool << client
                                                                        busy_threads = pool.wait_until_not_full
                                                                        if busy_threads == 0
                                                                          @options[:out_of_band].each(&:call) if @options[:out_of_band]
                                                                        end
                                                                      end
                                                                    rescue SystemCallError
                                                                      # nothing
                                                                    rescue Errno::ECONNABORTED
                                                                      # client closed the socket even before accept
                                                                      begin
                                                                        io.close
                                                                      rescue
                                                                        Thread.current.purge_interrupt_queue if Thread.current.respond_to? :purge_interrupt_queue
                                                                      end
                                                                    end
                                                                  end
                                                                end
                                                              rescue Object => e
                                                                @events.unknown_error self, e, "Listen loop"
                                                              end
                                                            end
                                                            @events.fire :state, @status
                                                            graceful_shutdown if @status == :stop || @status == :restart
                                                            if queue_requests
                                                              @reactor.clear!
                                                              @reactor.shutdown
                                                            end
                                                          end
                                                    end
                                                    return @thread
                                                  else
                                                    handle_servers
                                                  end
                                                end
                                          end
                                      case @status
                                      when :halt
                                        log "* Stopping immediately!"
                                      when :run, :stop
                                        graceful_stop
                                      when :restart
                                        log "* Restarting..."
                                        ENV.replace(previous_env)
                                        @runner.before_restart
                                        restart!
                                      when :exit
                                        # nothing
                                      end
                                      @binder.close_unix_paths
                                    end
                              rescue Interrupt
                                puts "* Gracefully stopping, waiting for requests to finish"
                                launcher.stop
                                puts "* Goodbye!"
                              end
                            end
                      end
                ensure
                  after_stop_callback.call if after_stop_callback
                end
          else
            say rack_server_suggestion(using)
          end
        end
      end
  end
end
```

如果你能跟随调用栈走到Rails.application.initialize!这一步，那么恭喜你不畏长途跋涉，终于到达了rails启动主体内容的入口。

```ruby
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/application.rb
def initialize!(group = :default) #:nodoc:
  raise "Application has been already initialized." if @initialized
  run_initializers(group, self)
      # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/initializable.rb
      def run_initializers(group = :default, *args)
        return if instance_variable_defined?(:@ran)
        initializers.tsort_each do |initializer|
          initializer.run(*args) if initializer.belongs_to?(group)
        end
        @ran = true
      end
  @initialized = true
  self
end

# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/application.rb
def initializers
  Bootstrap.initializers_for(self) +
  railties_initializers(super) +
  Finisher.initializers_for(self)
end

# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/initializable.rb
def run(*args)
  @context.instance_exec(*args, &block)
end

# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/initializable.rb
def initializer(name, opts = {}, &blk)
  raise ArgumentError, "A block must be passed when defining an initializer" unless blk
  opts[:after] ||= initializers.last.name unless initializers.empty? || initializers.find { |i| i.name == opts[:before] }
  initializers << Initializer.new(name, nil, opts, &blk)
end
```

initializers方法收集了所有的启动对象，依次调用每个对象的run方法完成启动，通过调用initializer注册启动对象。主要有三类启动对象

1. Booststrap（以下列出注册的各启动对象的name）
    - load_environment_hook
    - load_active_support
    - set_eager_load
    - initialize_logger
    - initialize_cache
    - initialize_dependency_machanism
    - bootstrap_hook
    - set_secrets_root

2. railties

    ```ruby
    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/engine/railties.rb
    module Rails
      class Engine < Railtie
        class Railties

          def initialize
            @_all ||= ::Rails::Railtie.subclasses.map(&:instance) +
              ::Rails::Engine.subclasses.map(&:instance)
          end
        end
      end
    end
    ```

    可以看到这一类启动对象包括了所有继承Railtie或继承Engine的类的实例

3. Finisher

    - add_generator_templates
    - ensure_autoload_once_paths_as_subset
    - warn_if_autoloaded
    - let_zeitwerk_take_overa
    - add_builtin_route
    - setup_default_session_store
    - build_middleware_stack
    - define_main_app_helper
    - add_to_prepare_blocks
    - run_prepare_callbacks
    - eager_load!
    - finisher_hook
    - configure_executor_for_concurrency
    - set_routes_reloader_hook
    - set_clear_dependencies_hook
    - disable_dependency_loading

    这里重点讲一下中间件的加载。

    ```ruby
    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/builder.rb
    def to_app
      app = @map ? generate_map(@run, @map) : @run
      fail "missing run or map statement" unless app
      app.freeze if @freeze_app
      app = @use.reverse.inject(app) { |a, e| e[a].tap { |x| x.freeze if @freeze_app } }
      @warmup.call(app) if @warmup
      app
    end

    #/Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/rack-2.2.2/lib/rack/server.rb
    def build_app(app)
      middleware[options[:environment]].reverse_each do |middleware|
        middleware = middleware.call(self) if middleware.respond_to?(:call)
        next unless middleware
        klass, *args = middleware
        app = klass.new(app, *args)
      end
      app
    end
    ```

    首先构建app的时候调用了 to_app 方法，Rack::Builder#use是rack应用注册中间件的方法，但是rails没有用，打断点查看@use为[]。

    wrap_app调用了build_app, 注册了rack在不同环境下默认的中间件

    rails 加载中间件的方式是通过启动对象build_middleware_stack，Rails::Application里面有这么一句 alias :build_middleware_stack :app

    ```ruby
    # /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/engine.rb
    def app
      @app || @app_build_lock.synchronize {
        @app ||= begin
          stack = default_middleware_stack
          config.middleware = build_middleware.merge_into(stack)
          config.middleware.build(endpoint)
        end
      }
    end
    ```

    在执行build_middleware_stack之前，config.middleware是Rails::Configuration::MiddlewareStackProxy, merge_into后变成了ActionDispatch::MiddlewareStack

源代码里扒出来的启动过程注释

```ruby
# /Users/yanjinkai/.rvm/gems/ruby-2.7.0/gems/railties-6.0.3.1/lib/rails/application.rb
# == Booting process
  #
  # The application is also responsible for setting up and executing the booting
  # process. From the moment you require "config/application.rb" in your app,
  # the booting process goes like this:
  #
  #   1)  require "config/boot.rb" to setup load paths
  #   2)  require railties and engines
  #   3)  Define Rails.application as "class MyApp::Application < Rails::Application"
  #   4)  Run config.before_configuration callbacks
  #   5)  Load config/environments/ENV.rb
  #   6)  Run config.before_initialize callbacks
  #   7)  Run Railtie#initializer defined by railties, engines and application.
  #       One by one, each engine sets up its load paths, routes and runs its config/initializers/* files.
  #   8)  Custom Railtie#initializers added by railties, engines and applications are executed
  #   9)  Build the middleware stack and run to_prepare callbacks
  #   10) Run config.before_eager_load and eager_load! if eager_load is true
  #   11) Run config.after_initialize callbacks
```

参考: <https://guides.rubyonrails.org/initialization.html>
