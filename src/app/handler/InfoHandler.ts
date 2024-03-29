/**
 * Copyright 2022 Dhiego Cassiano Fogaça Barbosa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { exec } from "child_process";

import { Handler, Request, Response } from "midori/http";

export default class InfoHandler extends Handler {
    #commit: string = '';

    async handle(req: Request): Promise<Response> {
        try {
            if (!this.#commit) {
                this.#commit = await new Promise<string>((resolve, reject) => {
                    exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(stdout);
                    });
                });
            }

            return Response.json({
                commit: this.#commit.trim(),
                project: 'httpbin',
            });
        } catch (e) {
            return Response.json({
                commit: 'unknown',
                project: 'httpbin',
            });
        }
    }
}
