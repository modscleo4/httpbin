import { Handler, Request, Response } from "apiframework/http";
import { exec } from "child_process";

export default class InfoHandler extends Handler {
    async handle(req: Request): Promise<Response> {
        const commit = await new Promise<string>((resolve, reject) => {
            exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }

                resolve(stdout);
            });
        });

        return Response.json({
            commit: commit.trim(),
            project: 'httpbin',
        });
    }
}
