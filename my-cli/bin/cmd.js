#!/usr/bin/env node
import { Command } from 'commander';
import { update, add, listCategoryItems, listCategories } from '../src/utils.js';

//create a new Command Program
const program = new Command();

//create a new program
program
  .name(`my-cli`)
  .description(`Back office for My App`)
  .version(`1.0.0`);

//create a command for adding a updating order
program
  .command('update')
  .argument('<ID>', 'Order ID')
  .argument("<AMOUNT>", "Order Amount")
  .action(async (id,amount) => await update(id,amount));


//create a command for listing categories by IDs
program
.command("add")
.description("add Product by ID to a Category")
.argument("<CATEGORY>", "Product Category")
.argument("<ID>", "Product ID")
.argument("<NAME>", "Product Name")
.argument("<AMOUNT>", "Product RRP")
.argument("[INFO...]", "Product Info")
.action(
  async (category, id, name, amount, info) =>
    await add(category, id, name, amount, info)
);

//create a command for listing categories
program
  .command("list")
  .description("List categories")
  .argument("[CATEGORY]", "category to list IDs for")
  .option("-a, --all", "list all categories")
  .action(async (args, opts) => {
    if (args && opts.all)
      throw new Error("cannot specify both category and 'all'");
    if (opts.all || args === "all") {
      listCategories();
    } else if (args === "confectionery" || args === "electronics") {
      await listCategoryItems(args);
    } else {
      throw new Error("Invalid category specified");
    }
  });

  //set the action to be executed when the command is run
program
  .action(async (args, opts) => {
  if (args && opts.all)
    throw new Error("Cannot specify both category and 'all'");
  if (opts.all || args === "all") {
    listCategories();
  } else if (args === "confectionery" || args === "electronics") {
    await listCategoryItems(args);
  } else {
    throw new Error("Invalid category specified");
  }
});

program.parse();