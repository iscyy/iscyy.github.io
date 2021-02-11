set -e
npm run docs:build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git remote add origin  https://github.com/Him-wen/Him-wen.github.io.git
git pull --rebase origin master
git push -f origin master