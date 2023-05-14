class Element {
    ref;
    constructor(ref) {
        this.ref = ref;
    }

    static new(type) {
        const ref = document.createElement(type);
        return new Element(ref)
    }
    

    children = (elementOrElements) => {
        if (!Array.isArray(elementOrElements)) {
            this.ref.appendChild(elementOrElements.ref);
        } else {
            elementOrElements.forEach(element => {
                this.ref.appendChild(element.ref);
            })
        }
        return this;
    }


    dyn_children = (childrenFactory, dependencies) => {
        this.children(childrenFactory());
        dependencies.forEach(dep => {
            dep.subscribe(() => {
                // Remove existing children
                while (this.ref.firstChild) {
                    this.ref.removeChild(this.ref.firstChild);
                }

                // Re-add children
                this.children(childrenFactory());
            });
        })
        return this;
    };



    text = (value) => {
        this.ref.textContent = value;
        return this;
    }

    dyn_text = (signal) => {
        this.ref.textContent = signal.get();

        signal.subscribe((newvalue) => {
            this.ref.textContent = newvalue;
        });

        return this;
    }

    
    attr = (name, value) => {
        this.ref.setAttribute(name, value);
        return this;
    }

    dyn_attr = (name, signal) => {
        console.log(name, signal.get());
        this.ref.setAttribute(name, signal.get());

        signal.subscribe((newValue) => {
            this.ref.setAttribute(name, newValue);
        });


        return this;
    }

    prop = (name, value) => {
        this.ref[name] = value;
        return this;
    }

    dyn_prop = (name, signal) => {
        this.ref[name] = signal.get();

        signal.subscribe((newValue) => {
            this.ref[name] = newValue;
        });

        return this;
    }

    on = (event, callback) => {
        this.ref.addEventListener(event, callback);
        return this;
    }

}

function mount(element, root) {
  document.getElementById(root).appendChild(element.ref);
}

function createSignal(initialValue) {
    let value = initialValue
    let listeners = [];
    const signal  = {
        set: (newValue) => {
            value = newValue;
            listeners.forEach((listener) => {
                listener(newValue)
            });
        },
        get: () => value,
        subscribe: (listener) => {
            listeners.push(listener);
        },
    };
    return signal;
}
