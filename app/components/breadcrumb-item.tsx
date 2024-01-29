import { ReactNode } from 'react';

type BreadcrumbProps = {
    children: ReactNode,
    link: string,
    isCurrent: boolean,
    triangle: boolean,
    direction: 'start' | 'end'
}

export const BreadcrumbItem = ({ children, link, isCurrent, triangle, direction }: BreadcrumbProps) => (
  <li
    className={`
      breadcrumb-item
      text-sm
      ${isCurrent ? 'text-gray-700 bg-gray-100' : 'text-gray-500 hover:text-gray-700'}
    `}
  >
    {triangle && direction === 'start' && (
      <span className="inline-block">
        <svg
          viewBox="0 0 5 5"
          className="w-5 h-5 fill-current"
          style={{ transform: 'rotate(0deg)' }}
        >
          <path d="M0 2.5L2.5 0L5 2.5Z" />
        </svg>
      </span>
    )}
    {link ? (
      <a href={link}>{children}</a>
    ) : (
      <span>{children}</span>
    )}
    {triangle && direction === 'end' && (
      <span className="inline-block ml-2">
        <svg
          viewBox="0 0 5 5"
          className="w-5 h-5 fill-current"
          style={{ transform: 'rotate(90deg)' }}
        >
          <path d="M0 2.5L2.5 0L5 2.5Z" />
        </svg>
      </span>
    )}
  </li>
);

type BreadcrumbsProps = {
    items: BreadcrumbProps[],
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <ul className="breadcrumbs flex items-center space-x-2">
    {items.map((item, index) => (
      <BreadcrumbItem
        key={index}
        {...item}
        isCurrent={index === items.length - 1}
        triangle={item.triangle}
        direction={item.triangle ? item.direction : "start"}
      />
    ))}
  </ul>
);


export default Breadcrumbs;
