import React from 'react';
import moment from 'moment';
import { render, fireEvent, flushEffects } from 'react-testing-library';
import {
  makeUniqueIdGenerator,
  dayNamesEnglish,
  Monday,
  Tuesday,
  ALL_DAYS_SELECTED,
} from 'shared';
import TodoList from 'app/TodoList';
import AppProviders from 'app/Providers';
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

const TEST_SUNDAY = moment('2018-12-23');
const TEST_MONDAY = moment('2018-12-24');

function renderTodoList(children, providerProps) {
  return render(<AppProviders {...providerProps}>{children}</AppProviders>);
}

export const createDefaultTodo = (text, overrides) => ({
  id: createUniqueId(),
  days: ALL_DAYS_SELECTED,
  text,
  isCompleted: false,
  ...overrides,
});

function assertTodoIsRendered(todo, { queryByText, queryByLabelText }) {
  expect(queryByText(todo.text)).toBeInTheDocument();
  expect(queryByLabelText(generateAriaLabelForTodo(todo))).toBeInTheDocument();
}

function assertTodoIsNotRendered(todo, { queryByText, queryByLabelText }) {
  expect(queryByText(todo.text)).not.toBeInTheDocument();
  expect(
    queryByLabelText(generateAriaLabelForTodo(todo))
  ).not.toBeInTheDocument();
}

test('no todos', () => {
  const { queryByLabelText } = renderTodoList(<TodoList />);
  expect(
    queryByLabelText(
      new RegExp(`^(${todoAriaLabelPart1})|(${todoAriaLabelPart2})$`, 'g')
    )
  ).toBeNull();
});

test('create a todo with defaults', () => {
  const { getByText, getByPlaceholderText, getByLabelText } = renderTodoList(
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
  const { getByText, getByPlaceholderText, getByLabelText } = renderTodoList(
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
  const renderResult = renderTodoList(
    <TodoList defaultTodos={defaultTodos} defaultDay={TEST_MONDAY} />
  );
  // Then I see each todo listed with a checkbox
  assertTodoIsRendered(todo1, renderResult);
  assertTodoIsRendered(todo2, renderResult);
});

test('filter todays todos', () => {
  const monday = 1;
  const tuesday = 2;
  const mondayTodo = createDefaultTodo('Do this', { days: [monday] });
  const tuesdayTodo = createDefaultTodo('Do that', { days: [tuesday] });
  const defaultTodos = [mondayTodo, tuesdayTodo];

  // Given it is Monday
  // Then when I view my todo list filtered by the day be default
  const renderResult = renderTodoList(
    <TodoList defaultTodos={defaultTodos} />,
    {
      currentDay: TEST_MONDAY,
    }
  );

  // Then I see my monday todo
  assertTodoIsRendered(mondayTodo, renderResult);

  // And not my tuesday todo
  assertTodoIsNotRendered(tuesdayTodo, renderResult);
});

test('remove a todo', () => {
  const todo1 = createDefaultTodo('Do this');
  const todo2 = createDefaultTodo('Do that');
  const defaultTodos = [todo1, todo2];

  // Given a list with 2 todos
  const renderResult = renderTodoList(<TodoList defaultTodos={defaultTodos} />);
  const { queryByLabelText } = renderResult;

  // When I click the delete button of one todo
  fireEvent.click(queryByLabelText(generateAriaLabelForDeleteButton(todo1)));

  // Then I see the remaining todo
  assertTodoIsRendered(todo2, renderResult);

  // And not the one I just removed
  assertTodoIsNotRendered(todo1, renderResult);
});

test('edit a todo', () => {
  const oldValue = 'Do this';
  const newValue = '100 Russian twists';
  const todo = createDefaultTodo(oldValue);
  const todo2 = createDefaultTodo('apple');
  const editButtonLabel = generateAriaLabelForEditTodoButton(todo);
  // Given a todo list with an existing todo
  const renderResult = renderTodoList(
    <TodoList defaultTodos={[todo, todo2]} />
  );
  const { container, queryByLabelText, getByText } = renderResult;

  assertTodoIsRendered(todo, renderResult);

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

test('on Sunday I do not see todos not assigned to Sunday', () => {
  const todo = createDefaultTodo('Jog', { days: [1, 2, 3, 4, 5] });
  const renderResult = renderTodoList(<TodoList defaultTodos={[todo]} />, {
    currentDay: TEST_SUNDAY,
  });

  assertTodoIsNotRendered(todo, renderResult);
});

test('on Sunday I see todos assigned to Sunday', () => {
  const todo = createDefaultTodo('Jog', { days: [0] });
  const renderResult = renderTodoList(<TodoList defaultTodos={[todo]} />, {
    currentDay: TEST_SUNDAY,
  });

  assertTodoIsRendered(todo, renderResult);
});

test('on Monday I do not see todos not assigned to Monday', () => {
  const todo = createDefaultTodo('Jog', { days: [0, 2, 3, 4, 5] });
  const renderResult = renderTodoList(<TodoList defaultTodos={[todo]} />, {
    currentDay: TEST_MONDAY,
  });

  assertTodoIsNotRendered(todo, renderResult);
});

test('on Monday I see todos assigned to Monday', () => {
  const todo = createDefaultTodo('Jog', { days: [1] });
  const renderResult = renderTodoList(<TodoList defaultTodos={[todo]} />, {
    currentDay: TEST_MONDAY,
  });

  assertTodoIsRendered(todo, renderResult);
});
