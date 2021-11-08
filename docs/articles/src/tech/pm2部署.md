---
date: 2021-9-30
tags: 
  - pm2
  - deploy
---

# pm2部署

## 背景

工作中要部署一个node写的tcp服务，尝试了部署在k8s里面，端口不通，时间紧迫就先改用传统方式部署。只有一台服务器，要部署测试和正式两个服务。

## 配置文件

```js
module.exports = {
  apps : [{
    name: 'tcp_server', // master分支改为tcp_server_prod
    script: 'node server.js',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }],

  deploy : {
    development : {
      user : '',
      host : '',
      ref  : 'origin/dev',
      repo : '',
      path : '/srv/tcp_server',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development',
      'pre-setup': ''
    },
    production : {
      user : '',
      host : '',
      ref  : 'origin/master',
      repo : '',
      path : '/srv/tcp_server_prod',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

## 部署命令

```sh
pm2 deploy ecosystem.config.js development setup
pm2 deploy ecosystem.config.js development
```

## 一些问题

### ssh免密 & 别名登录

```sh
#别名
echo 'Host 别名\n Hostname <ip>\n User <username>' > ~/.ssh/config
#免密
ssh-copy-id 别名 #或者
scp ~/.ssh/id_rsa.pub user@host:~/.ssh/authorizes_keys
```

### 报错pm2/npm/yarn/node找不到的解决方法

[参考链接](https://segmentfault.com/q/1010000013392948)
将命令从实际位置软链接到/usr/bin

```sh
whereis pm2
pm2: /opt/nodejs/bin/pm2
sudo ln -s /opt/nodejs/bin/pm2 /usr/bin/pm2
```

### 每次提交后部署拉不到最新代码

搜了下是服务器git版本问题: <https://github.com/Unitech/pm2/issues/2935>  
于是重新安装git: <https://www.cnblogs.com/wxwgk/p/11983253.html>

```sh
git --version
yum remove git
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel asciidoc unzip
yum install  gcc perl-ExtUtils-MakeMaker
cd /usr/local/src/
wget -O git.zip https://github.com/git/git/releases/tag/v2.33.0
unzip git.zip
cd git-master
make prefix=/usr/local/git all
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >> ~/.bashrc
source ~/.bashrc
git --version
```

这里可能wget下载不到git的压缩包，可以浏览器访问下载:joy:再scp到服务器上
