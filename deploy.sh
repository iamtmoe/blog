cd docs/articles && git pull && cd -
npm run build
num=`date '+%Y%m%d%H%M%S'`
scp -r docs/.vuepress/dist alinode:/var/www/blog/$num
ssh alinode "rm -f /var/www/blog/current && ln -s /var/www/blog/$num /var/www/blog/current"