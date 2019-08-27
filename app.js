const fs = require('fs');

const readFile = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) return reject(error);

            resolve(data);
        });
    });
};

// 输入、输出文件
const inputPath = './iconfont.css';
const outputPath = 'iconList.txt';

// 读取文件名键值对
(async function () {
    const data = await readFile(inputPath);
    let fileData = data.toString();

    // 匹配.icon-certified:before
    let regexp = /.icon-(\S*):before/g;

    // 匹配结果
    let iconList = fileData.match(regexp);

    // 排序
    iconList.sort();
    iconList = iconList.map(item => item.replace(/\.icon/, 'icon').replace(/:before/, ''));

    // 将结果写入file
    iconList.forEach(iconName => {
        fs.appendFile(outputPath, `${iconName}\n`, 'utf8', (err) => {
            if (err) return console.log(err);

            if(!err) {
                console.log('写入成功！');
            }
        });
    });
})();

