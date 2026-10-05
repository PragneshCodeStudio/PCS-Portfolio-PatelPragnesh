import { FaLinkedinIn, FaCodepen, FaGithub } from "react-icons/fa6";
import resumePdf from "../assets/documents/Pragnesh_CV.pdf";

export const profile = {
  name: "Patel Pragnesh",
  email: "pragneshpatel0707@gmail.com",
  resumeUrl: resumePdf,
};

export const socialLinks = [
  {
    label: "LinkedIn",
    Icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/pragneshpatel0707",
  },
  {
    label: "CodePen",
    Icon: FaCodepen,
    href: "https://codepen.io/PRAGNESH-CODE-STUDIO/",
  },
  {
    label: "GitHub",
    Icon: FaGithub,
    href: "https://github.com/PragneshCodeStudio",
  },
];
