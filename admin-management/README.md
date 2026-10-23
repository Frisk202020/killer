# Admin management

While players are managed through the online API, admins are managed by running local scripts **offline**. As such, the *admins* database is completely safe from online cyber attacks (a remote attacker can't access the *admins* database).

To run a script, prompt in a terminal (from project root) :

```bash
bun admin-management/<SCRIPT_NAME>.ts <ARGUMENTS>
```

> Notice : while players have no password guideline, we enforce admins password's strength as they can do anything on the database. Rule is : 8 characters minimum with 1 lowercase and 1 uppercase, 1 number and 1 special character.

## Available scripts

### Get administrators

To get all administrators, use `get.ts`.

**Example**:

```bash
bun admin-management/get.ts
```

### Create an administrator

To create an administrator, use `create.ts`

**Arguments**:

- `name` : display name
- `pwd` : password to use 
- `discord` : discord account ID

**Example**:

```bash
bun admin-management/get.ts name="Frisk" pwd="P&rdu:(0" discord="frisk2824"
```

### Update an administrator

To update an administrator, use `update.ts`

**Arguments**:
 
- `name` : display name
- `pwd` (optional) : new password to use
- `discord`(optional) : new discord id

**Example**:

```bash
bun admin-management/update.ts name="Frisk" pwd="Qu0!coubeh" discord="frisk2825"
```

### Delete an administrator

To delete an administrator, use `delete.ts`.

**Arguments**:

- `name` : display name

**Example**:

```bash
bun  admin-management/delete.ts name="Frisk"
```

- `get` : get all admins registered in database (name and discord ID)

- `create name=<NAME> discord=<DISCORD_ID> pwd=<PWD>` : in order to create a new admin in database with t

- `delete` : in order to delete an existing admin in database
- `update` : in order to update the password and/or the discord ID of an admin