const { cd, exec, echo, touch } = require('shelljs')

echo('Building demo!!!')
cd('demo/speechless-react-demo')
touch('.nojekyll')
exec('yarn')
exec('yarn build')
echo('Demo Building!!')
