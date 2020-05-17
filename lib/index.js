const path = require('path');
const rm = require('rimraf');
const archiver = require('archiver');
const chalk = require('chalk');
const archive = archiver('zip', {
    zlib: { level: 9 }
});
const fs = require('fs');
const arr=['-','\\','|','/'];
var count=0;
let stdout;
class WebpackPluginZipFiles {
    constructor(options) {
        //自定义压缩文件名
        if (!options) {
            options = {};
        }
        this.customPath = options.customPath || 'app-1.0.0.zip';
        // 是否删除输出目录
        this.removeOutputFile = !!options.removeOutputFile;
        // 输出目录默认值
        this.outputPath = path.resolve(process.cwd(), './dist');
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap(
            'WebpackPluginZipFiles',
            (compilation) => {
                this.outputPath = compilation.outputOptions.path;
                Promise.resolve().then(()=>{this.main()});
            }
        );
    }
    //检查输出目录是否有文件  有的话就删除
    run() {
        const self = this;
        if (this.removeOutputFile) {
            const stat = fs.existsSync(this.outputPath);
            if (stat) {
                console.log(chalk.yellow('outputPath : %s directory already exists plan to removing it'), this.outputPath);
                rm(this.outputPath, {}, function () {
                    console.log(chalk.green('removed %s'), self.outputPath);
                })
            }
        }

    }
    //
    main() {
        stdout=setInterval(function(){
            count++;
            count=count%4;
            process.stderr.write('\x1b[33m'+arr[count]+"    正在压缩"+'\x1b[?25l');
            process.stderr.cursorTo(0)
            
        },10)
        const self = this;
        const realCustomPath = path.resolve(process.cwd(), './' + this.customPath);
        const zipStat = fs.existsSync(realCustomPath);
        if (zipStat) {
            console.log(chalk.yellow('file : %s already exists plan to removing it'), realCustomPath);
            rm(realCustomPath, {}, function () {
                console.log(chalk.green('removed %s'), realCustomPath);
                let zip = fs.createWriteStream('./' + self.customPath);
                zip.on('close', function () {
                    console.log(chalk.green('-----zip success----'));
                    self.run();
                    process.stderr.write('\x1b[37m')
                    process.stderr.clearLine(0)
                    clearInterval(stdout)
                
                });
                const pathname = './' + self.outputPath.split(path.sep).pop();
                self.zipBall(pathname, zip)
            })
        }else{
                let zip = fs.createWriteStream('./' + self.customPath);
                const pathname = './' + self.outputPath.split(path.sep).pop();
                zip.on('close', function () {
                    console.log(chalk.green('-----zip success----'));
                    self.run();
                    process.stderr.write('\x1b[37m')
                    process.stderr.clearLine(0)
                    clearInterval(stdout)
                });
                self.zipBall(pathname, zip)
        }
    }
    zipBall(pathname, zip) {
        archive.glob(pathname + '/**');
        archive.pipe(zip);
        archive.finalize();
    }
}
module.exports = WebpackPluginZipFiles