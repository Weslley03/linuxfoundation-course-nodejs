#!/usr/bin/env node
import { Command } from 'commander';
import { update, add, listCategoryItems, listCategories } from '../src/utils.js';
import { categories, interactiveApp } from '../src/prompts.js';

//create a new Command Program
const program = new Command();

//create a new program
program
  .name(`my-cli`)
  .description(`Back office for My App`)
  .version(`1.0.0`)
  .option("-i, --interactive", "Run App in interactive mode")
  .action(() => { });

//create a command for updating an order
program
  .command("update")
  .description("Update an order")
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[ID]", "Order ID")
  .argument("[AMOUNT]", "Order Amount");

//create a command for listing categories by IDs
program
  .command("add")
  .description("Add Product by ID to a Category")
  //set the option to run command in interactive mode
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .argument("[CATEGORY]", "Product Category")
  .argument("[ID]", "Product ID")
  .argument("[NAME]", "Product Name")
  .argument("[AMOUNT]", "Product RRP")
  .argument("[INFO...]", "Product Info");

//create a command for listing categories
program
  .command("list")
  .description("List categories")
  //set the option to run command in interactive mode
  .option("-i, --interactive", "Run Update Command in interactive mode")
  .option("-a, --all", "List all categories")
  .argument("[CATEGORY]", "Category to list IDs for");

//parse the arguments from process.argv
program.parse();

//main function to run the program
async function main(program) {
  //get the command, process.args and options
  const command = program?.args.at(0) || "";
  const cliArgs = program?.args.slice(1) || [];
  const options = program?.opts() || {};

  //guard clauses
  if (!command && !options.interactive) {
    //display the help
    program.help();
  }
  if (!command && options.interactive) {
    //run the interactive app
    return interactiveApp();
  }
  if (command && options.interactive) {
    //run the interactive app with the command
    return interactiveApp(command);
  }
  if (options.interactive && cliArgs.length > 0) {
    throw new Error("Cannot specify both interactive and command");
    process.exit(1);
  }
  //execute the command
  switch (command) {
    case "add": {
      const [category, id, name, amount, info] = cliArgs;
      if (
        !categories.includes(category) ||
        !category ||
        !id ||
        !name ||
        !amount
      ) {
        throw new Error("Invalid arguments specified");
      }
      await add(category, id, name, amount, info);
      break;
    }
    case "update": {
      const [id, amount] = cliArgs;
      if (!id && !amount) {
        throw new Error("Invalid arguments specified");
      }
      await update(id, amount);
      break;
    }
    case "list": {
      const { all } = options;
      const [category] = cliArgs;
      if (category && all)
        throw new Error("Cannot specify both category and 'all'");
      if (all || category === "all") {
        listCategories();
      } else if (categories.includes(category)) {
        await listCategoryItems(category);
      } else {
        throw new Error("Invalid category specified");
      }
      break;
    }
    default:
      await interactiveApp();
  }
}

//run the main function
main(program);