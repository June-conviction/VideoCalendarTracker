export interface IpodColor {
  id: string;
  name: string;
  bgClass: string;
  image: string;
}

export const ipodColors: IpodColor[] = [
  {
    id: "silver",
    name: "Silver",
    bgClass: "bg-[hsl(var(--ipod-silver))]",
    image: "/assets/ipod-silver.svg"
  },
  {
    id: "black",
    name: "Black",
    bgClass: "bg-[hsl(var(--ipod-black))]",
    image: "/assets/ipod-black.svg"
  },
  {
    id: "pink",
    name: "Pink",
    bgClass: "bg-[hsl(var(--ipod-pink))]",
    image: "/assets/ipod-pink.svg"
  },
  {
    id: "green",
    name: "Green",
    bgClass: "bg-[hsl(var(--ipod-green))]",
    image: "/assets/ipod-green.svg"
  },
  {
    id: "blue",
    name: "Blue",
    bgClass: "bg-[hsl(var(--ipod-blue))]",
    image: "/assets/ipod-blue.svg"
  }
];
