const fs = require('fs');
const path = require('path');

let filePath = process.argv[2]; // 获取输入的参数

let iconList = [];
const iconReg1 = /\"#?icon-(\S*)\"/g;
const iconReg2 = /\'#?icon-(\S*)\'/g;

const outputPath = 'iconResult.txt';

// 执行
readDir(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function readDir(filePath) {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.warn(err);
        } else {
            // 遍历读取到的文件列表
            files.map(filename => {
                // 获取当前文件的绝对路径
                const fileDir = path.join(filePath, filename);

                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(fileDir, (error, stats) => {
                    if (error) {
                        console.warn('获取文件stats失败');
                    } else {
                        const isFile = stats.isFile(); // 是文件
                        const isDir = stats.isDirectory(); // 是文件夹

                        if (isFile) {
                            (async function () {
                                let fileData = await readFile(fileDir);
                                fileData = fileData.toString();

                                // 匹配结果
                                let matchIcons1 = fileData.match(iconReg1);
                                let matchIcons2 = fileData.match(iconReg2);

                                if(matchIcons1) {
                                    iconList = [...iconList, ...matchIcons1];
                                }

                                if(matchIcons2) {
                                    iconList = [...iconList, ...matchIcons2];
                                }

                                // 数据处理
                                iconList = iconList.map(item => item.replace(/#/, '').replace(/"/, '').replace(/'/, ''));
                                iconList = [...new Set(iconList)];
                                iconList.sort();

                                console.log('iconList:', iconList);

                                // 更新file
                                fs.writeFile(outputPath, iconList, 'utf8', (err) => {
                                    if (err) return console.log(err);

                                    if(!err) {
                                        console.log('写入成功！');
                                    }
                                });
                            })();
                        }
                        if (isDir) {
                            if(!fileDir.includes('/assets')) {
                                readDir(fileDir); // 递归，如果是文件夹就继续遍历
                            }
                        }
                    }
                })
            });
        }
    });
}


// 文件读取
const readFile = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (error, data) => {
            if (error) return reject(error);

            resolve(data);
        });
    });
};