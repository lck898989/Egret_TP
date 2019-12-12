/// 阅读 api.d.ts 查看文档
// tslint:disable-next-line: no-reference
///<reference path="api.d.ts"/>

import { CleanPlugin, CompilePlugin, EmitResConfigFilePlugin, ExmlPlugin, ManifestPlugin, TextureMergerPlugin, UglifyPlugin } from "built-in";
import * as path from "path";
import * as defaultConfig from "./config";

const config: ResourceManagerConfig = {

    buildConfig: (params) => {
        const { target, command, projectName, version } = params;
        const outputDir = `../${projectName}_android/assets/game`;
        if (command == "build") {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
                    new ManifestPlugin({ output: "manifest.json" }),
                ],
            };
        } else if (command == "publish") {
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["js", "resource"] }),
                    new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js",
                    },
                    ]),
                    new ManifestPlugin({ output: "manifest.json" }),
                ],
            };
        } else {
            throw new Error(`unknown command : ${params.command}`);
        }
    },

    mergeSelector: defaultConfig.mergeSelector,

    typeSelector: defaultConfig.typeSelector,
};


export = config;
