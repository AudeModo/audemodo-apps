import type { ReactElement } from 'react';

import { IconCircleCheckFilled } from '@tabler/icons-react';

import type { TodoItem } from '@/entities/dashboard';

import styles from './todo-list.module.css';

interface TodoListProps {
  items: TodoItem[];
}

/**
 * 할 일.
 *
 * 완료를 아래로 내리지 않는다 — 적은 순서가 곧 생각한 순서다. 정렬을 바꾸면
 * 무엇을 먼저 하려 했는지가 사라진다.
 */
export const TodoList = ({ items }: TodoListProps): ReactElement => {
  if (items.length === 0) {
    return <p className={styles.empty}>할 일이 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li className={styles.row} data-done={item.done} key={item.text}>
          {item.done ? (
            <IconCircleCheckFilled aria-hidden className={styles.done} size={14} />
          ) : (
            <span aria-hidden className={styles.todo} />
          )}

          {item.text}
        </li>
      ))}
    </ul>
  );
};
