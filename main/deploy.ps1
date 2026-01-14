Push-Location .vuepress/dist

git init
git add -A
git commit -m 'deploy'

git checkout -B vuepress-page
git push -f git@github.com-jxch:jxch/jxch.github.io.git vuepress-page

Pop-Location