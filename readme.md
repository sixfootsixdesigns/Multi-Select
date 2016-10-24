# Multi Select Plugin

This plugin creates a multi select function for a select box.

```
<link rel="stylesheet" href="/css/style.css">

<form id="my-form" action="/">
    <div class="form-group">
        <label for="input-01">Select</label>
        <select id="input-01" name="field[]" class="multi-select">
            <option value="">Any</option>
            <option value="">Choose More</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
            <option value="5">Option 5</option>
        </select>
        <ul class="multi-select-list">
            <li hidden></li>
        </ul>
    </div>

    <div class="form-group">
        <label for="input-02">Select 2</label>
        <select id="input-02" name="field2[]" class="multi-select">
            <option value="">Any</option>
            <option value="" selected>Choose More</option>
            <option value="1" disabled>Option 1</option>
            <option value="2" disabled>Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
            <option value="5">Option 5</option>
        </select>
        <ul class="multi-select-list">
            <li hidden></li>
            <li><span class="multi-select-remove" title="Remove">&times;</span><input type="hidden" name="field2[]" value="1">Option 1</li>
            <li><span class="multi-select-remove" title="Remove">&times;</span><input type="hidden" name="field2[]" value="2">Option 2</li>
        </ul>
    </div>    
</form>

<script src="jquery.multi-select.js"></script>
<script>
    jQuery(document).ready(function($) {
        $('#my-form').multiSelect();
    });
</script>
```

Usually, I have some sort of loop to build out the html for fields that need to be persisted. 