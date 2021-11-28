const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../model/index')

router.get('/', async (req, res, next) => {
  const contactList = await listContacts()
  return contactList
    ? res.json({
      status: 'Success',
      code: 200,
      data: contactList
    })
    : res.status(404).json({
      status: 'Error',
      code: 404,
      data: { Erorr: 'Can not get contacts' }
    })
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params.contactId)
  if (!contact) {
    res.status(404).json({
      status: 'Error',
      code: 404,
      data: { message: `Error: Contact with id ${req.params.contactId} not found` }
    })
    return
  }
  res.json({
    status: 'success',
    code: 200,
    data: { contact }
  })
})

router.post('/', async (req, res, next) => {
  const newContact = await addContact(req.body)
  newContact.error
    ? res.status(400).json({
      status: 'Error',
      code: 400,
      data: { message: 'Missing required name field' }
    })
    : res.status(201).json({
      status: 'Success',
      code: 201,
      data: newContact
    })
})

router.delete('/:contactId', async (req, res, next) => {
  const delitedContact = await removeContact(req.params.contactId)
  console.log('~ delitedContact', delitedContact)

  delitedContact
    ? res.json({
      status: 'Success',
      code: 200,
      data: { message: `Contact with id ${delitedContact.id} and name ${delitedContact.name} was deleted` }
    })
    : res.status(404).json({
      status: 'Error',
      code: 404,
      data: { message: `Error: Contact with id ${req.params.contactId} not found` }
    })
})

router.patch('/:contactId', async (req, res, next) => {
  const { params: { contactId }, body } = req
  const updatedContact = await updateContact(contactId, body)
  console.log('~ updatedContact', updatedContact)

  return updatedContact
    ? res.json({
      status: 'Success',
      code: 200,
      data: { message: `Contact with id ${contactId} and name ${updatedContact.name} was patched` }
    })
    : res.status(400).json({
      status: 'Error',
      code: 400,
      data: { message: 'missing fields' }
    })
})

module.exports = router
