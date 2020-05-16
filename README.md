# Markomatic

Generate Markdown files using partial templates and YAML configuration

## Usage

Install markomatic
```
npm install -g markomatic
```

Create your template file, e.g. `document.template.md`
```md
# Hello

It's {{ name }}, I like {{ hobby }}.

## Fruits

My favourite fruits are:
{% for fruit in fruits %}
    - {{ fruit }} {% endfor %}
```

Create your markomatic config file, e.g. `markomatic.yaml`
```yaml
markomatic :
    input: ./document.template.md
    output : ./document.md
    variables :
        name : John
        hobby : programming
        fruits :
            - Apple
            - Orange
            - Avocado
            - Melon
```

Run the markomatic generator
```sh
$ markomatic ./markomatic
```

That's all! Check the output at `./document.md`
```md
# Hello

It's John, I like programming.

## Fruits

My favourite fruits are:

    - Apple 
    - Orange 
    - Avocado 
    - Melon 

```
## Contributing

This project is following [git-flow branching model](https://github.com/echamudi/echamudi-docs/raw/master/git-strategy/gitflow.pdf). 
- Please create a branch from `develop`.
- Name it something descriptive other than `master`, `develop`, `release-*`, or `hotfix-*`.
- Open a pull request to `develop`.

Make sure your contributions are compatible with the license of this code.

## Development

| Branch | Status |
| - | - |
| master | [![Build Status](https://travis-ci.org/echamudi/markomatic.svg?branch=master)](https://travis-ci.org/echamudi/markomatic) |
| develop | [![Build Status](https://travis-ci.org/echamudi/markomatic.svg?branch=develop)](https://travis-ci.org/echamudi/markomatic) |

The development of this project is following [gitflow](https://github.com/nvie/gitflow) branching model.

## License

Copyright © Ezzat Chamudi

Markomatic code is licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/). 

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.
