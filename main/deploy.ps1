Push-Location .vuepress/dist

git init
git add -A
git commit -m 'deploy'

git checkout -b vuepress-page
git push -f git@github.com:jxch/jxch.github.io.git vuepress-page

Pop-Location