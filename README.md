# ValWrap

[![PyPI - Version](https://img.shields.io/pypi/v/ValWrap?label=ValWrap)](https://pypi.org/project/ValWrap/)
![GitHub deployments](https://img.shields.io/github/deployments/ValUtils/ValWrap/deploy?label=deploy)
![GitHub](https://img.shields.io/github/license/ValUtils/ValWrap)

A Python module containing the [techchrism](https://valapidocs.techchrism.me/) valorant endpoints.

## Features

- Full type definitions
- Based in ValLib

## Installation

The preferred method of installation is through `pip` but if you know better use the package manager that you want.

```sh
pip install ValWrap
```

## Reference

### Usage

For using this module you'll require to be comfortable in how [ValLib](https://github.com/ValUtils/ValLib) works, since it's based off of that for auth.

```python
import ValLib
from ValLib.api import get_extra_auth

user = ValLib.User("Test", "TestPassword")
auth = ValLib.authenticate(user)
extra = get_extra_auth(auth)

match_history = get_match_history(extra)

print(match_history)
```

### Endpoints

The endpoints are functions that start by the http method (get, put, post or delete) and then the name of the [techchrism](https://valapidocs.techchrism.me/) endpoints in lowercase and snakecase.

## Roadmap

- [ ] Async
- [ ] More endpoints
- [ ] Better documentation

## Acknowledgements

- Thanks to [Techdoodle](https://github.com/techchrism) for his API docs
