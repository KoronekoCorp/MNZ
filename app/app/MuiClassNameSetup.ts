import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';
import { createHash } from "crypto"


// 用于阻止脚本
function generateUniqueString(input: string): string {
    console.log(input)
    const hash = createHash('sha256').update(input + process.env.BUILD_ID).digest('hex');
    return hash.slice(0, 16);
}

ClassNameGenerator.configure(generateUniqueString);
