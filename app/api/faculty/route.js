import fs, { readFileSync } from "fs"
import path from "path"

const filepath=path.join(process.cwd(),'data/faculty.json');

export async function GET()
{
    try {
        const data=JSON.parse(fs.readFileSync(filepath,'utf-8'));
        return new Response(JSON.stringify(data),{
            status: 200,
            headers: { 'content-type' : 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({error:'Could not read file'}),{
            status: 500
        })
    }

}
