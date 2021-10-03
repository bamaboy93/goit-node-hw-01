const { Command } = require("commander");
const chalk = require("chalk");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");
const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      try {
        const contacts = await listContacts();
        console.log(chalk.green("Contacts:"));
        console.table(contacts);
      } catch (err) {
        console.error(err.message);
      }
      break;

    case "get":
      try {
        const contact = await getContactById(id);

        if (contact) {
          console.log(chalk.green("Found contact:"));

          console.table(contact);

          return;
        } else {
          console.log(chalk.red("There is no contact with such ID"));
        }
      } catch (err) {
        console.error(err.message);
      }
      break;

    case "add":
      try {
        const contacts = await addContact(name, email, phone);

        console.log(chalk.green("Added new Contact"));
        console.table(contacts);
      } catch (err) {
        console.error(err.message);
      }
      break;

    case "remove":
      try {
        const contacts = await removeContact(id);

        if (!contacts) {
          console.log(chalk.yellow("There is no contact with such ID "));
          return;
        }

        console.log(
          chalk.green(
            "Contact with ID: " + chalk.red(id) + " was deleted from the list"
          )
        );

        if (!contacts.length) {
          console.log(chalk.yellow("No contacts!"));
          return;
        }

        console.table(contacts);
      } catch (err) {
        console.error(err.message);
      }
      break;

    default:
      console.warn(chalk.red("Unknown action type!"));
  }
}

invokeAction(argv);
