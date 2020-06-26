# Sharepoint Webpart Remote Development

## Server setup

- Put file `proxy.html` to the sharepoint document and make sure it is accessible from browser
- Setup IIS to allow the file are able to be put on an HTML `iframe` element. This requires iis `url rewrite module` to be installed

### Configuring IIS URL rewrite module

- From the sharepoint site in the iis manager, open the url rewrite tool
- Click the `Add Rule(s)` link from the action side bar
- From the outbound rules section, select the `Blank rule`, then click Ok button
- In the `Precondition`, select the `Create New Precondition`
- In the `Using` selection, select the `Regular Expressions` option
- In the `Logical grouping`, select the `Match all` option. This is optional, since we will only put one condition
- Click the `Add` button, and fill the form with
    - Condition input: `{RESPONSE_CONTENT_TYPE}`
    - Check if input string: `Matches the Pattern`
    - Pattern: `^text/html`
    - Ignore case: **checked**
- Click the `Ok` button
- In the `Match` section, fill the form with
    - Matching scope: `Server Variable`
    - Variable name: `RESPONSE_X_FRAME_OPTIONS`
    - Variable valie: `Matches the Pattern`
    - Using: `Regular Expressions`
    - Pattern: `.+`
    - Ignore case: **checked**
- Leave the `Condition` section as it is
- In the `Action` section, fill the form with
    - Action type: `Rewrite`
    - In the Action Properties leave the `Value` empty and make sure the `Replace existing server variable value` to be checked.
- Click `Apply` in the side bar

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
