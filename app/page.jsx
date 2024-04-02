'use client'
import Image from "next/image";
import Head from "next/head";
import { Navbar, NavbarBrand, NavbarContent, Input, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import axios from 'axios'; // Import axios for HTTP requests

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');

  useEffect(() => {
    // Fetch todos from API on component mount
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    try {
      const response = await axios.post('/api/todos', { text: todoText });
      setTodos([...todos, response.data]);
      setTodoText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id == id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todoText.trim()) return;
    handleAddTodo();
  };

  return (
    <>
      <Navbar isBordered isBlurred={false}>
        <NavbarBrand>
          <p className="font-bold text-inherit">Etolist</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button onPress={onOpen} color="primary" variant="flat">
              Add
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Add todo</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  value={todoText}
                  onChange={(e) => setTodoText(e.target.value)}
                  label="Enter your task"
                  variant="underlined"
                  className="w-full" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <div
        className='grid grid-cols-3 lg:grid-cols-5 gap-[5px] text-white text-lg text-center'>
        <div className='col-span-1 hidden lg:block order-2 lg:order-1 container'><h1>Left</h1></div>
        <div className='w-screen lg:col-span-3 order-1 lg:order-2 lg:container pt-5 px-2'>
          {todos.map((todo) => (
            <div key={todo.id} className='flex flex-col items-center justify-center'>
              <div className='md:w-[600px] px-5 flex justify-between items-center w-full h-24 bg-primary/10 mb-4 rounded-lg'>
                <h1>{todo.text}</h1>
                <div className="*:m-1 flex flex-col">
                  <Button>Edit</Button>
                  <Button color="secondary" onPress={() => handleDeleteTodo(todo.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='col-span-1 hidden lg:block order-3 lg:order-3 container'><h1>Right</h1></div>
      </div>
    </>
  );
}
