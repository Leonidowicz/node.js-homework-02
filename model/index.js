const fs = require('fs/promises')
const path = require('path')
const Joi = require('joi')

const contactsPath = path.join(__dirname, 'contacts.json')

async function readContacts() {
  return JSON.parse(await fs.readFile(contactsPath))
}
async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
}

const schemaRequired = Joi.object({
  name: Joi.string()
    .required(),
  email: Joi.string()
    .required(),
  phone: Joi.string()
    .required(),
})
const schemaOptional = Joi.object({
  name: Joi.string()
    .optional(),
  email: Joi.string()
    .optional(),
  phone: Joi.string()
    .optional(),
})

const listContacts = async () => {
  try {
    return await readContacts()
  } catch (error) { return null }
}

const getContactById = async (contactId) => {
  const contacts = await readContacts()
  const contact = contacts.find(item => item.id === Number(contactId))
  return contact || null
}

const addContact = async ({ name, email, phone }) => {
  const validateBody = schemaRequired.validate({ name, email, phone })

  if (validateBody.error) {
    return validateBody
  } else {
    const id = new Date().getTime()
    const newContact = { id, ...validateBody.value }
    const contacts = await readContacts()
    await writeContacts([...contacts, newContact])
    return newContact
  }
}

const removeContact = async (contactId) => {
  const contacts = await readContacts()
  const index = contacts.findIndex(item => item.id === Number(contactId))
  if (index === -1) {
    return null
  } else {
    const [deleteContact] = contacts.splice(index, 1)
    await writeContacts(contacts)
    return deleteContact
  }
}

const updateContact = async (contactId, body) => {
  const validateBody = schemaOptional.validate(body)
  if (validateBody.error) {
    return null
  }
  const contacts = await readContacts()
  const index = contacts.findIndex(item => item.id === Number(contactId))
  if (index === -1) {
    return null
  }
  contacts.splice(index, 1, { ...contacts[index], ...validateBody.value })
  await writeContacts(contacts)
  return validateBody.value
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
