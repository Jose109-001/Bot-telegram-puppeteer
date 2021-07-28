module.exports = (index) => {
    const iframe = document.querySelector('iframe');
    const script = document.createElement('script');
    
    script.text = `(() => {
        // Get source and target elements
        var source = document.querySelector('div div div').querySelectorAll('div')[2 + ${index}];
        var target = document.querySelector('div div div').querySelectorAll('div')[6];
        source.style.background = 'blue';
        target.style.background = 'black';
    
        // Object to be used by the validation script
        const dataTransfer = {
            getData () { return '${index}' },
            setData () {}
        };
    
        // Mousedown event
        let event = document.createEvent("CustomEvent");
        event.initCustomEvent("mousedown", true, true, null);
        event.clientX = source.getBoundingClientRect().top;
        event.clientY = source.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        source.dispatchEvent(event);
    
        // Dragstart event
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("dragstart", true, true, null);
        event.clientX = source.getBoundingClientRect().top;
        event.clientY = source.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        source.dispatchEvent(event);
    
        // Drag event
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("drag", true, true, null);
        event.clientX = source.getBoundingClientRect().top;
        event.clientY = source.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        source.dispatchEvent(event);
    
        // Dragover event
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("dragover", true, true, null);
        event.clientX = target.getBoundingClientRect().top;
        event.clientY = target.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        target.dispatchEvent(event);
    
        // Drop event
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("drop", true, true, null);
        event.clientX = target.getBoundingClientRect().top;
        event.clientY = target.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        target.dispatchEvent(event);
    
        // Dragend event
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("dragend", true, true, null);
        event.clientX = target.getBoundingClientRect().top;
        event.clientY = target.getBoundingClientRect().left;
        event.dataTransfer = dataTransfer;
        target.dispatchEvent(event);
    })()`

    // Inject script inside of validation iframe
    iframe.contentDocument.body.appendChild(script);
}