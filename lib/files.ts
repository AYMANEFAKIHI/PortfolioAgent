import fs from "node:fs";
import path from "node:path";

const pub = (f: string) => fs.existsSync(path.join(process.cwd(), "public", f));

/** headshot.png missing → the hero shows a dark silhouette placeholder. */
export const hasHeadshot = () => pub("headshot.png");
/** aymane_fakihi.pdf missing → the resume download button is hidden. */
export const hasResumePdf = () => pub("aymane_fakihi.pdf");
