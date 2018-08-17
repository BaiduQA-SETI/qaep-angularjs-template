bash -c "$( curl http://jumbo.baidu.com/install_jumbo.sh )"; source ~/.bashrc
{
    version=`node -v`
} || {
    version="v0"
}

echo $version
if [[ "$version" > "v6" ]]
then
    echo "> v6 skip install node"
else
    echo "node version is lower than v6, need upgrade"
    jumbo remove nodejs
    jumbo install nodejs
    echo "Install node "`node -v`" successfully"
fi

npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
cnpm install webpack -g
cd mockserver
cnpm install
