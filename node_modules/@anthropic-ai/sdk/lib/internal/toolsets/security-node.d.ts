import type { BetaFilePolicy, BetaURLContext } from "./hooks.js";
/** Whether `candidate` resolves to `root` or a descendant of it. Both sides may be not-yet-existing. */
export declare function resolvesUnder(candidate: string, root: string): Promise<boolean>;
/**
 * Default-deny upload allowlist: resolves to the real path when it is one of `roots` or below one by whole path
 * components, with symlinks resolved on both sides, and rejects with `UploadRefusedError` otherwise. The refusal
 * never lists the roots. Empty `roots` refuses everything. A root that does not exist on disk grants
 * nothing. A `..` component (and, on Windows, a UNC path or a DOS device name) is refused outright, before the
 * filesystem is touched. A dangling symlink or a symlink cycle under a root is refused rather than judged by its
 * target. Upload the returned path, not the argument.
 */
export declare function betaCheckUploadPath(candidate: string, roots: Iterable<string>): Promise<string>;
export interface BetaNodeFilePolicyOptions {
    /** `file_upload` may read paths under these directories. Empty (the default) refuses every path. */
    uploadRoots?: readonly string[] | undefined;
    /**
     * Where the driver writes downloads. Exposed paths must resolve under it. Its overlap with the upload roots is
     * compared on the paths as written, ignoring letter case, so a `downloadDir` that is, or sits under, a working
     * symlink into an upload root is not caught, nor is an upload root that links into `downloadDir`. A link that
     * does not resolve is refused.
     */
    downloadDir?: string | undefined;
    /** Default false: download paths never reach the model. Has no effect without `downloadDir`. */
    exposeDownloadPaths?: boolean | undefined;
    /** Document ids (files staged with the Files API) `file_upload` may name. Empty (the default) refuses every id. */
    uploadDocumentIds?: readonly string[] | undefined;
}
/**
 * The file policy the SDK ships: `file_upload` may read paths under `uploadRoots` (symlinks resolved,
 * whole components compared, a `..` component refused outright) and may name the document ids listed in
 * `uploadDocumentIds` (none by default), and a `download_completed` path reaches the model only with
 * `exposeDownloadPaths: true` and only when it lies inside `downloadDir`.
 *
 * Keep the roots to one dedicated directory holding only the task's files, and put `downloadDir`
 * outside every upload root and outside anything another tool can reach. The driver decides where
 * downloads are written, and this object only decides what the model may see.
 */
export declare class BetaNodeFilePolicy implements BetaFilePolicy {
    readonly uploadRoots: readonly string[];
    readonly downloadDir: string | undefined;
    readonly exposeDownloadPaths: boolean;
    readonly uploadDocumentIds: ReadonlySet<string>;
    constructor(options?: BetaNodeFilePolicyOptions);
    resolveUploadPaths(_ctx: BetaURLContext, paths: string[]): Promise<string[]>;
    resolveUploadDocuments(_ctx: BetaURLContext, documentIds: string[]): string[];
    isPathVisible(candidate: string): Promise<boolean>;
}
//# sourceMappingURL=security-node.d.ts.map