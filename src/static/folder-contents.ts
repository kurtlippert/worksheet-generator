import { readdirSync, statSync } from 'fs'
import { tryCatch } from 'libs/monads'
import { join, normalize } from 'path'

interface File {
    checked: boolean,
    created: Date,
    name: string,
    path: string,
    size: number,
    type: string,
}

interface Directory {
    name: string,
    path: string,
    type: string
}

export const folderContents = (folderPath: string) => 
    tryCatch(() => normalize(folderPath))
        .fold((_: any) => 'error getting folder path',
              (normPath: string) => readdirSync(normPath)
                    .map((child: string) => {
                        const childPath = join(normPath, child)
                        const childStat = statSync(childPath)
                        return childStat.isDirectory() ?
                            {
                                name: child,
                                path: childPath,
                                type: 'directory',
                            } as Directory :
                            {
                                checked: false,
                                created: childStat.ctime,
                                name: child,
                                path: childPath,
                                size: childStat.size,
                                type: 'file',
                            } as File
                    })
                    .sort((a: Directory | File, b: Directory | File) => {
                        if (a.type === 'directory' && b.type === 'file') {
                            return -1
                        } else if (a.type === 'file' && b.type === 'directory') {
                            return 1
                        } else {
                            return a.path.localeCompare(b.path)
                        }
                    }),
               )

//    filepath = normalize(filepath);
//
//    const stats = lstatSync(filepath);
//    const info = {
//        children: [""],
//        name: basename(filepath),
//        path: filepath,
//        type: "",
//    };
//
//    if (stats.isDirectory()) {
//        info.type = "directory";
//        info.children = readdirSync(filepath).filter((child) => {
//            return statSync(join(filepath, child)).isDirectory();
//        });
//        info.children.sort((a, b) => {
//            if (a.type === "directory" && b.type === "file") return -1;
//            if (b.type === "directory" && a.type === "file") return 1;
//
//            a.type 
//
//            return a.path.localeCompare(b.path);
//        })
//    } else {
//        info.type = "file";
//    }
//    return info;

