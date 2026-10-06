import { BsGithub } from "react-icons/bs";

const StyledFooter = ({ label }: { label: string }) => (
  <footer className="bg-primary py-6 text-center text-sm text-primary-foreground/70">
    <p>{label}</p>
    <a
      href="https://github.com/SzymonRojek"
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub profile"
      className="mt-3 inline-flex text-brand hover:text-brand/80"
    >
      <BsGithub className="size-6" />
    </a>
  </footer>
);

export default StyledFooter;
