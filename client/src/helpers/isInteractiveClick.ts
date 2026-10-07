import { MouseEvent } from "react";

// a click on a link, a button or a menu item inside a clickable row does its own job
// (React events from portals - e.g. the "..." menu - bubble through the row too)
const isInteractiveClick = (event: MouseEvent) =>
  event.target instanceof Element &&
  Boolean(event.target.closest("a, button, input, [role='menuitem'], [role='menu']"));

export default isInteractiveClick;
