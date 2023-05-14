



function TodoItem(props) {
    let value = createSignal(props.text);

    return Element.new("div")
            .attr("class", "flex gap-3 w-full")
            .children(Element.new("input").attr("type", "checkbox"))
            .children(Element.new("span").text(props.text).attr("class", "mr-auto"))
            .children(Element.new("button").text("delete").on("click", () => props.onDelete(props.id)))
}


function App() {
    const todoText = createSignal("");
    const todos = createSignal([]);

    const addTodo = () => {
        todos.set([...todos.get(), { id: todos.get().length + 1, text: todoText.get(), complete: false }]) 
        todoText.set("");
    }

    const handleInputChange = (event) => todoText.set(event.target.value);
    
    const removeTodo = (id) => {
        const newTodos = [...todos.get()].filter(todo => todo.id !== id);
        todos.set(newTodos);
    }

    return Element.new("div")
        .attr("class", "w-full h-[100vh] bg-gray-900 text-slate-300 flex flex-col items-center justify-center gap-3")
        .children(Element.new("h1").text("My To-do list").attr("class", "text-2xl"))
        .children(
            Element.new("div")
            .attr("class", "flex gap-2")
            .children(
                Element.new("input")
                .attr("class", "p-3 bg-gray-700 rounded")
                .prop("placeholder", "What's next...?")
                .dyn_prop("value", todoText)
                .on("change", handleInputChange)
            )
            .children(
                Element.new("button")
                .attr("class", "bg-red-400 text-gray-900 px-4 rounded font-bold")
                .text("add")
                .on("click", addTodo)
            )
        )
        .children(
            Element.new("ul")
            .attr("class", "w-1/3")
            .dyn_children(
                () => {
                    return todos.get().map((todo) => TodoItem({ 
                        id: todo.id, 
                        text: todo.text,
                        complete: todo.complete, 
                        onDelete: removeTodo, 
                    }))
                }, [todos])
        );
}

mount(App(), "root");

