import React from 'react';
import moment from 'moment';
import { render, fireEvent } from 'react-testing-library';
import {
  makeUniqueIdGenerator,
  dayNamesEnglish,
  Monday,
  Tuesday,
  ALL_DAYS_SELECTED,
  getTodoFilters,
} from 'shared';
import TodoList from 'app/TodoList';
import { messages as todoFormMessages } from 'app/TodoForm';
import { messages as dayPickerMessage } from 'app/DayPicker';
import {
  messages as todoMessage,
  generateAriaLabelForTodo,
  generateAriaLabelForEditTodoButton,
  todoAriaLabelPart1,
  todoAriaLabelPart2,
  generateAriaLabelForDeleteButton,
} from 'app/TodoListItem';

const createUniqueId = makeUniqueIdGenerator('todo');

const TEST_MONDAY = moment('2018-12-24');

export const createDefaultTodo = (text, overrides) => ({
  id: createUniqueId(),
  days: ALL_DAYS_SELECTED,
  text,
  isCompleted: false,
  ...overrides,
});

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
  const saveButton = getByText(todoFormMessages.saveLabel);
  const input = getByPlaceholderText(todoFormMessages.todoTextPlaceholder);

  // When I add a todo and save
  fireEvent.change(input, {
    target: { value: 'Yowzer' },
  });
  fireEvent.click(saveButton);

  // Then my todo is saved and has default days selected
  expect(getByText('Yowzer')).toBeInTheDocument();
  fireEvent.click(getByText('Edit'));
  const selectedDays = getByLabelText(dayPickerMessage.allDaysLabel);
  expect(selectedDays).toHaveAttribute('checked');
});

test('create a todo with with custom days', () => {
  const { getByText, getByPlaceholderText, getByLabelText } = render(
    <TodoList defaultDay={TEST_MONDAY} />
  );
  // Given an empty todo list
  const saveButton = getByText(todoFormMessages.saveLabel);
  const input = getByPlaceholderText(todoFormMessages.todoTextPlaceholder);
  // When I add a todo and select only Monday and Tuesday
  fireEvent.change(input, {
    target: { value: 'Yowzer' },
  });
  fireEvent.click(getByLabelText(dayPickerMessage.allDaysLabel));
  fireEvent.click(getByLabelText(Monday));
  fireEvent.click(getByLabelText(Tuesday));
  fireEvent.click(saveButton);

  // Then my todo is saved and has expected days selected
  expect(getByText('Yowzer')).toBeInTheDocument();
  fireEvent.click(getByText(todoMessage.editLabel));
  expect(getByLabelText(dayPickerMessage.allDaysLabel)).not.toHaveAttribute(
    'checked'
  );
  expect(getByLabelText(Monday)).toHaveAttribute('checked');
  expect(getByLabelText(Tuesday)).toHaveAttribute('checked');
});

test('list todos', () => {
  const todo1 = createDefaultTodo('Do this');
  const todo2 = createDefaultTodo('Do that');
  const defaultTodos = [todo1, todo2];
  // Given a todo list with existing todos
  const { getByLabelText, getByText } = render(
    <TodoList defaultTodos={defaultTodos} defaultDay={TEST_MONDAY} />
  );
  // Then I see each todo listed with a checkbox
  expect(getByText(todo1.text)).toBeInTheDocument();
  expect(getByLabelText(generateAriaLabelForTodo(todo1))).toBeInTheDocument();
  expect(getByText(todo2.text)).toBeInTheDocument();
  expect(getByLabelText(generateAriaLabelForTodo(todo2))).toBeInTheDocument();
});

test('filter todays todos', () => {
  const monday = 1;
  const tuesday = 2;
  const mondayTodo = createDefaultTodo('Do this', { days: [monday] });
  const tuesdayTodo = createDefaultTodo('Do that', { days: [tuesday] });
  const defaultTodos = [mondayTodo, tuesdayTodo];

  // Given it is Monday
  // Then when I view my todo list filtered by the day be default
  const { queryByLabelText, queryByText } = render(
    <TodoList defaultTodos={defaultTodos} defaultDay={TEST_MONDAY} />
  );

  // Then I see my monday todo
  expect(queryByText(mondayTodo.text)).toBeInTheDocument();
  expect(
    queryByLabelText(generateAriaLabelForTodo(mondayTodo))
  ).toBeInTheDocument();

  // And not my tuesday todo
  expect(queryByText(tuesdayTodo.text)).not.toBeInTheDocument();
  expect(
    queryByLabelText(generateAriaLabelForTodo(tuesdayTodo))
  ).not.toBeInTheDocument();
});

test('remove a todo', () => {
  const todo1 = createDefaultTodo('Do this');
  const todo2 = createDefaultTodo('Do that');
  const defaultTodos = [todo1, todo2];

  // Given a list with 2 todos
  const { queryByLabelText, queryByText } = render(
    <TodoList defaultTodos={defaultTodos} />
  );

  // When I click the delete button of one todo
  fireEvent.click(queryByLabelText(generateAriaLabelForDeleteButton(todo1)));

  // Then I see the remaining todo
  expect(queryByText(todo2.text)).toBeInTheDocument();
  expect(queryByLabelText(generateAriaLabelForTodo(todo2))).toBeInTheDocument();

  // And not the one I just removed
  expect(queryByText(todo1.text)).not.toBeInTheDocument();
  expect(
    queryByLabelText(generateAriaLabelForTodo(todo1))
  ).not.toBeInTheDocument();
});

test('edit a todo', () => {
  const oldValue = 'Do this';
  const newValue = '100 Russian twists';
  const todo = createDefaultTodo(oldValue);
  const todo2 = createDefaultTodo('apple');
  const editButtonLabel = generateAriaLabelForEditTodoButton(todo);
  // Given a todo list with an existing todo
  const { container, queryByLabelText, getByText } = render(
    <TodoList defaultTodos={[todo, todo2]} defaultDay={TEST_MONDAY} />
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
  fireEvent.click(queryByLabelText(dayPickerMessage.allDaysLabel));
  fireEvent.click(queryByLabelText(Monday));
  fireEvent.click(queryByLabelText(Tuesday));
  fireEvent.click(getByText(todoFormMessages.saveLabel));

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
  fireEvent.click(getByText(todoMessage.editLabel));
  expect(queryByLabelText(dayPickerMessage.allDaysLabel)).not.toHaveAttribute(
    'checked'
  );
  dayNamesEnglish.forEach(d => {
    if (d === Monday || d === Tuesday) {
      expect(queryByLabelText(d)).toHaveAttribute('checked');
    } else {
      expect(queryByLabelText(d)).not.toHaveAttribute('checked');
    }
  });
});
