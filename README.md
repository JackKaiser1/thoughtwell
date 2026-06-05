![Thoughtwell](./assets/thoughtwell%20full%20logo%20small.svg)


---


Thoughtwell is a web application for working out new ideas.  It allows users to create and write to flexible notebooks that can be nested to form a hierarchical structure.  This provides the user with the ability to freely follow spontaneous thought to any level of specificity while establishing a record of the natural branching of one's ideas.  


## Motivation


I am a large proponent of taking notes when learning a new concept or building upon an idea.  I enjoy the kineticism and satisfying freedom that the classic pen and paper method allows for.  Though I try my best not to fix something that isn't broken, the stack of notebooks amassed on my desk led me to the realization that I needed a better way to organize this information.  If you're thinking the modern rich text editors of today would seem to be the next logical choice for a tool in which to write something down, I wouldn't blame you.  My problem with such tools is simple: there are too many options for my intended goal.  If my understanding of an abstract concept begins with the ability to write it in my own voice, then I want as little friction as possible between myself and that understanding.  I required a solution to record ideas in the same spontaneous fashion as I can with a pen and paper while granting myself an organizational capability beyond the physical limitations of the common notebook.  This led me to develop Thoughtwell, a program that allows a user to create digital notebooks where the content is larger than the container.


## Features


- Nested Notebooks
    - Create a notebook and write to it. Create a notebook inside of the first notebook and write to that. Continue this pattern as much as you wish.


- Write Mode
    - A minimalistic interface for writing down a thought, clearing the board, and writing the next thought. All written notes are scoped to the currently selected notebook. If no notebook is selected, then you are writing to Loose Pages.
   
- Loose Pages
    - Just start writing.  Pages not written directly to a notebook can be found in the Loose Pages tab.  These pages can be accessed within and added to any other notebook.


- Top Level Notebooks
    - Any notebook that is not nested inside another notebook is a top level notebook.  Consider these the root of the tree of content you will create within each notebook.


- Context Menu
    - As you navigate the depths of your own thoughts, a context menu will appear by right clicking just as you would expect it to.
    - The context menu allows you to perform the following:
        - Create new notebooks
        - Move selected pages to a notebook at your current level
        - Clear selected pages
        - Clear selected notebooks
        - Delete a page
        - Delete a notebook


- Authenticated User Accounts
    - To begin using Thoughtwell, you must first create an account.  Once an account is established, all of the data you create will thereby belong to said account.  This prevents other users from accessing or altering your data.


- Authorized User Actions
    - For every action in the frontend there exists a request to the backend server via a RESTful API. Before performing the pending action, the server must verify that the user making said request is not only who they claim to be, but is allowed to make such a request.  This verification is handled by stateless access tokens and stateful refresh tokens, both of which are supplied when the user logs in. The submission and renewal of access tokens is handled automatically within the individual user session.  This means the end user does not have to be worried about nor have any idea of this feature to keep their data secure.


- Persistent Data
    - Every change you make in Thoughtwell corresponds to the state of a relational database.  The data model is responsible for storing the relationship between every page in every notebook to every page in every other notebook, so you can be sure that the content and structure of your notes remains consistent with your direct actions across every session.


## Core Technologies


- Backend
    - Typescript
    - Node
    - Express
    - Drizzle ORM


- Database
    - PostgreSQL


- Frontend
    - Typescript
    - Vue
    - Vue Router
    - Pinia

---