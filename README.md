# Sharepoint Webpart Remote Development Example

This is a proof of concept of how to build sharepoint webpart, while also accessing sharepoint api, remotely.

## Server setup

- Put the `proxy.html` file to the sharepoint document and make sure it is accessible from the browser
- Setup IIS to allow the file to be able to be put into an HTML `iframe` element. This requires iis `url rewrite module` to be installed

### Configuring IIS URL rewrite module

- From the sharepoint site in the iis manager, open the url rewrite tool
- Click the `Add Rule(s)` link from the action side bar
- From the `outbound rules` section, select the `Blank rule`, then click Ok button
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

### List Schema

#### CourseCategories

| Field Name | Field Type | Remarks |
| --- | --- | --- |
| Title | Single line of text | |

#### Courses

| Field Name | Field Type | Remarks |
| --- | --- | --- |
| Title | Single line of text | |
| Description | Single line of text | |
| Category | Lookup (CourseCategories) | |

#### CoursesDependencies

| Field Name | Field Type | Remarks |
| --- | --- | --- |
| Parent | Lookup (Courses) | |
| Child | Lookup (Courses) | |

--------------------------------------------------------------

## Project setup
```
yarn install
```

### Environment Variables

- Copy `.env.example` file in the same directory as `.env` or `.env.local`
- Fill the variable value as following
    - `VUE_APP_SERVER_HOST` is the server address. For example `http://demoserver/`
    - `VUE_APP_PROXY_PAGE` is the proxy page, the `proxy.html` file, in the server. For example `http://demoserver/Site Assets/proxy.html`
    - `VUE_APP_CLIENT_HOST` is your local host for development. For example `localhost` or `127.0.0.1`
    - `VUE_APP_CLIENT_PORT` is yout local port for development. For example `8080`
    - `VUE_APP_BASE_URL` is refering to webpack `baseUrl` or `publicPath` and also used as `vue-router` base. This variable ignored in development mode

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
