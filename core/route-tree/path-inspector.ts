export class PathInspector {
    extractParametes(path: string, filledPath: string) {
        const filledSegments = filledPath.replace(/^\//, '').split('/');

        return path.split('/')
            .map((segment, i) => ({param: segment, value: filledSegments[i] }))
            .filter(segment => segment.param.startsWith(':'));
    }

    inject(params, path: string): string {
        let filledPath = path;

        params.forEach(param => {
            filledPath = filledPath.replace(param.param, param.value);
        });

        return filledPath;
    }
}
