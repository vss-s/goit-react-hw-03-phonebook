import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as helpers from './helpers/helpers';
import ContactForm from './components/ContactForm/ContactForm';
import ContactList from './components/ContactList/ContactList';
import Filter from './components/Filter/Filter';

export default class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    try {
      const persistedData = localStorage.getItem('contacts');
      if (persistedData)
        this.setState({ contacts: [...JSON.parse(persistedData)] });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate() {
    const { contacts } = this.state;

    try {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (e) {
      console.log(e);
    }
  }

  handleAddContact = (name, number) => {
    const { contacts } = this.state;

    if (helpers.isUniqueContact(contacts, name)) {
      alert(`${name} is already in contact!`);
      return false;
    }

    const newContact = {
      id: uuidv4(),
      name: name,
      number: number,
    };
    this.setState(state => ({
      contacts: [...state.contacts, newContact],
    }));

    return true;
  };

  handleDeleteContact = id => {
    const { contacts } = this.state;

    const filteredContacts = contacts.filter(item => item.id !== id);
    this.setState({ contacts: [...filteredContacts] });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { contacts, filter } = this.state;

    const filteredItems = helpers.filterContact(contacts, filter);

    return (
      <>
        <h1 className="appTitle">Phonebook</h1>
        <ContactForm addContact={this.handleAddContact} />
        <h2 className="contactsTitle">Contacts</h2>
        <Filter handleChange={this.handleChange} />
        {contacts.length > 0 && (
          <ContactList
            contacts={filteredItems}
            handleDelete={this.handleDeleteContact}
          />
        )}
      </>
    );
  }
}
