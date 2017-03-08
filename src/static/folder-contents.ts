import { readdirSync, statSync } from 'fs'
import { either, tryCatch } from 'libs/monads'
import { basename, join, normalize } from 'path'

export interface File {
    checked: boolean,
    created: Date,
    name: string,
    path: string,
    size: number,
}

export interface Folder {
    name: string,
    path: string,
}
//
// export const folderContents = (folderPath: string) => 
//    tryCatch(() => normalize(folderPath))
//        .fold((_: any) => 'error getting folder path',
//              (normPath: string) => readdirSync(normPath)
//                    .map((child: string) => {
//                        const childPath = join(normPath, child)
//                        const childStat = statSync(childPath)
//                        return childStat.isDirectory() ?
//                            {
//                                name: child,
//                                path: childPath,
//                                type: 'directory',
//                            } as Directory :
//                            {
//                                checked: false,
//                                created: childStat.ctime,
//                                name: child,
//                                path: childPath,
//                                size: childStat.size,
//                                type: 'file',
//                            } as File
//                    })
//                    .sort((a: Directory | File, b: Directory | File) => {
//                        if (a.type === 'directory' && b.type === 'file') {
//                            return -1
//                        } else if (a.type === 'file' && b.type === 'directory') {
//                            return 1
//                        } else {
//                            return a.path.localeCompare(b.path)
//                        }
//                    }),
//               ) as String

//export const getFolders = (folderPath: string) =>
//    tryCatch(() => normalize(folderPath))
//        .chain((normPath: string) => tryCatch(readdirSync(normPath)))
//            .fold((_: any) => 'error getting folder path',
//                  (contents: string[]) => contents
//                    .filter((child: string) => statSync(child).isDirectory())
//                    .map((childPath: string) => {
//                        return {
//                            name: basename(childPath),
//                            path: childPath,
//                        } as Directory
//                    }),
//            ) as Directory[] | string   // typescript can't infer monadic types, we have to help it out      
//
//const getFoldersNom = (folderPath: string) =>
//    tryCatch(() => normalize(folderPath))
//        .chain((normPath: string) => tryCatch(readdirSync(normPath)))
//        .fold((_: any) => 'error getting folder path',
//              (contents: string[]) => contents)
//

//const getFoldersNom = (folderPath: string) => 
//    tryCatch(() => readdirSync(normalize(folderPath)))
//        .fold((_: any) => 'error getting folder path',
//              (contents: string[]) => contents)
    
// I want an either, but before I fold, I'd like to chain the either with a try/catch of the normalized path
// The either catches a null value, the tryCatch catches invalid paths
// NOTE: The null will never happen in typescript (if string is specified as the type annotation),
// but as soon as the type changes to 'any' etc., we'll need that either
//const getFoldersNom = (folderPath: any) =>
//    either(folderPath)
//        .map((path: string) => normalize(path))         
//        .chain((normPath: string) => 
//            tryCatch(() => readdirSync(normPath))
//                .map((contents: string[]) => contents
//                    .filter((child: string) => statSync(join(normPath, child)).isDirectory())
//                    .map((childPath: string) => {
//                        return {
//                            name: basename(childPath),
//                            path: childPath,
//                        } as Directory
//                    }),
//                ),
//        )
        
// I want an either, but before I fold, I'd like to chain the either with a try/catch
// which attempts to read the normalized path as a directory.
//
// I want to map over the contents of the directory ('map' being the monad that evaluates the try/catch function)
// filter out either non-directories or files, map over those results ('map' here being a list map)
// and return json (typescript represents the shape of the object as a 'Folder' or 'File').
//
// Finally I fold. The left side will return an error string. If anything in our pipeline goes wrong,
// this function will be the one that evaluates, otherwise, I return the results
  
/** 
 * Gets all the folders in the path.
 * 
 * Returns 'Folder' object 
 * 
 * @param folderPath path of the folder
 */
const getFolders = (folderPath: string) =>
    either(folderPath)
        .map((path: string) => normalize(path))
        .chain((normPath: string) => 
            tryCatch(() => readdirSync(normPath))
                .map((contents: string[]) => contents
                    .filter((child: string) => statSync(join(normPath, child)).isDirectory())
                    .map((childPath: string) => {
                        return {
                            name: basename(childPath),
                            path: childPath,
                        } as Folder
                    }),
                ),
        )
        .fold((_: any) => 'error getting folder path',
              (folders: Folder[]) => folders) as Folder[] | string
         
        
        

//        .fold((_: any) => 'error getting folder path',
//              (contents: string[]) => contents
//                .filter((child: string) => statSync()))
//              (contents: string[]) => contents)

//              (contents: string[]) => contents )


//    tryCatch(() => normalize(folderPath))
//        .fold((_: any) => 'error getting folder path',
//              (normPath: string) => readdirSync(normPath)
//                .filter((child: string) => statSync(join(normPath, child)).isDirectory())
//                .map((childPath: string) => {
//                    return {
//                        name: basename(childPath),
//                        path: childPath,
//                    } as Directory
//                }),
//        ) as Directory[] | string   // typescript can't infer monadic types, we have to help it out
//
export const getFiles = (folderPath: string) => 
    tryCatch(() => normalize(folderPath))
        .fold((_: any) => 'error getting folder path',
              (normPath: string) => readdirSync(normPath)
                .filter((child: string) => !statSync(join(normPath, child)).isDirectory())
                .map((childPath: string) => {
                    const childStat = statSync(childPath)
                    return {
                        checked: false,
                        created: childStat.ctime,
                        name: basename(childPath),
                        path: childPath,
                        size: childStat.size,
                    } as File
                }),
        ) as File[] | string

//console.log(getFolders("C:\dev\etl-explorer\etl-testbed\ETL"))
console.log(getFolders(null))
console.log(getFolders("C:\dev\etl-explorer\etl-testbed\ETL"))

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

