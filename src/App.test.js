import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import {
  createDefaultTodo,
  TODO_PLACEHOLDER,
  todoAriaLabelPart1,
  todoAriaLabelPart2,
  generateAriaLabelForTodo,
  generateAriaLabelForEditTodoButton,
  TodoList,
  messages,
  Monday,
  Tuesday,
  dayNamesEnglish,
} from './App';

test('no todos', () => {
  const { queryByLabelText } = render(<TodoList />);
  expect(
    queryByLabelText(
      new RegExp(`^(${todoAriaLabelPart1})|(${todoAriaLabelPart2})$`, 'g')
    )
  ).toBeNull();
});

test('create a todo with defaults', () => {
  const { getByText, getByPlaceholderText, getByLabelText } = render(
    <TodoList />
  );
  // Given an empty todo list
  const saveButton = getByText(messages.saveLabel);
  const input = getByPlaceholderText(TODO_PLACEHOLDER);

  // When I add a todo and save
  fireEvent.change(input, {
    target: { value: 'Yowzer' },
  });
  fireEvent.click(saveButton);

  // Then my todo is saved and has default days selected
  expect(getByText('Yowzer')).toBeInTheDocument();
  fireEvent.click(getByText('Edit'));
  const selectedDays = getByLabelText(messages.allDaysLabel);
  expect(selectedDays).toHaveAttribute('checked');
});

test('create a todo with with custom days', () => {
  const { getByText, getByPlaceholderText, getByLabelText } = render(
    <TodoList />
  );
  // Given an empty todo list
  const saveButton = getByText(messages.saveLabel);
  const input = getByPlaceholderText(TODO_PLACEHOLDER);

  // When I add a todo and select only Monday and Tuesday
  fireEvent.change(input, {
    target: { value: 'Yowzer' },
  });
  fireEvent.click(getByLabelText(messages.allDaysLabel));
  fireEvent.click(getByLabelText(Monday));
  fireEvent.click(getByLabelText(Tuesday));
  fireEvent.click(saveButton);

  // Then my todo is saved and has expected days selected
  expect(getByText('Yowzer')).toBeInTheDocument();
  fireEvent.click(getByText(messages.editLabel));
  expect(getByLabelText(messages.allDaysLabel)).not.toHaveAttribute('checked');
  expect(getByLabelText(Monday)).toHaveAttribute('checked');
  expect(getByLabelText(Tuesday)).toHaveAttribute('checked');
});

test('list todos', () => {
  const todo1 = createDefaultTodo('Do this');
  const todo2 = createDefaultTodo('Do that');
  const defaultTodos = [todo1, todo2];
  // Given a todo list with existing todos
  const { getByLabelText, getByText } = render(
    <TodoList defaultTodos={defaultTodos} />
  );
  // Then I see each todo listed with a checkbox
  expect(getByText(todo1.text)).toBeInTheDocument();
  expect(getByLabelText(generateAriaLabelForTodo(todo1))).toBeInTheDocument();
  expect(getByText(todo2.text)).toBeInTheDocument();
  expect(getByLabelText(generateAriaLabelForTodo(todo2))).toBeInTheDocument();
});

test('edit a todo', () => {
  const oldValue = 'Do this';
  const newValue = '100 Russian twists';
  const todo = createDefaultTodo(oldValue);
  const todo2 = createDefaultTodo('apple');
  const editButtonLabel = generateAriaLabelForEditTodoButton(todo);
  // Given a todo list with an existing todo
  const { container, queryByLabelText, getByText } = render(
    <TodoList defaultTodos={[todo, todo2]} />
  );
  expect(
    queryByLabelText(generateAriaLabelForEditTodoButton(todo))
  ).toBeInTheDocument();
  const editButton = queryByLabelText(editButtonLabel);

  // When I edit a todo and change its value and uncheck all days
  fireEvent.click(editButton);
  const input = container.querySelector(`input[value="${todo.text}"]`);
  fireEvent.change(input, {
    target: { value: newValue },
  });
  fireEvent.click(queryByLabelText(messages.allDaysLabel));
  fireEvent.click(getByText(messages.saveLabel));

  // Then I no longer see the old todo value but the new one
  expect(
    queryByLabelText(generateAriaLabelForEditTodoButton(todo))
  ).not.toBeInTheDocument();
  expect(
    queryByLabelText(
      generateAriaLabelForEditTodoButton({
        ...todo,
        text: newValue,
      })
    )
  ).toBeInTheDocument();
  fireEvent.click(getByText(messages.editLabel));
  expect(queryByLabelText(messages.allDaysLabel)).not.toHaveAttribute(
    'checked'
  );
  dayNamesEnglish.forEach(d =>
    expect(queryByLabelText(d)).not.toHaveAttribute('checked')
  );
});
