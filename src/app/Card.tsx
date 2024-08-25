import { FC } from "react";

type CardProps = {
  content: string;
}

const Card: FC<CardProps> = ({ content }) => (
  <div className="rounded-lg shadow-md flex bg-gray-100 justify-center text-center items-center min-h-[200px] m-4">
    <h3 className="text-2xl font-bold text-gray-800">{content}</h3>
  </div>
)

export default Card;