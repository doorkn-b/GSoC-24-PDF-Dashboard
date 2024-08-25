# GSoC'24 - Arnab Mukherjee
## (LHAPDF) Online dashboard and data-visualisation for parton density functions
## Mentors- Andy Buckley, Chris Gutschwow
Over the summer I had the opportunity to work on developing a web-based visualization dashboard for Parton Density Functions (PDFs), which are important for interpreting data from the Large Hadron Collider (LHC). 

This was a fantastic journey of learning and development under the supervision of very knowledgeable and supportive mentors.

### A short description of the goals of the project:
The goals of the project consisted of:
- An online dashboard for generating and visualizing 1D, 2D heatmaps and 3D surface plots of PDFs.
- Visualize uncertainty bands around PDF fits to assess the reliability and variability of the data.
- Enable comparison of different PDF fits to explore differences.
- A reliable and intuitive tool for physicists.

### What I was able to achieve (current state):
I was able to develop the front-end and back-end of the dashboard entirely and get it working with the intended features, this is the breakdown of each section:

#### Backend Development
- Developed a backend that interacts with the LHAPDF library to fetch PDF values based on user inputs. The backend handles calculations involving flavours, x values, Q values, and Q² values to derive the PDF data.
- Implemented logic to calculate the PDF values based on user-specified parameters, including the ability to compute outer products for different combinations of x and Q values.
- Structured the backend to format the retrieved PDF data into JSON, making it easy for the front-end to parse and display the information in 1D, 2D, and 3D plots.
- Added error handling to manage invalid inputs and edge cases, ensuring the backend can  handle unexpected situations.

#### Interactive Dashboard:
- Designed an interface for selecting PDF sets and plotting parameters. The interface includes drop-down menus for PDF sets, and checkboxes for logarithmic scaling options.
- Dynamic Plot Updates: Enabled users to add and remove PDF sets dynamically, with real-time updates to plots without reloading the page.
- Clear Plot Functionality: Added a button to clear the plots, allowing users to reset the graph for new data without refreshing the entire page.

#### Plotting Tools:
Based on this PDF data retrieved, I created the front-end functionality in the dashboard for:
- 1D Plotting: Implemented functionality for creating 1D plots of Parton Density Functions (PDFs). Users can plot multiple PDF sets on the same graph, with options for logarithmic scaling on the x, Q, and y axes.
- 2D Plotting: Developed 2D heatmaps to visualize PDFs over a range of x and Q² values. The plots support logarithmic scaling for both axes.
- 3D Plotting: Created interactive 3D surface plots for visualizing PDFs in three dimensions (x, Q², PDF Value), including options for logarithmic scaling.

#### Handling of Uncertainty Bands:
Uncertainty Visualization: Incorporated the ability to plot uncertainty bands on the 1D plots, using min and max values returned from the backend to visualize the uncertainty associated with different PDF fits.

### The Code:
All the code for the current state of the project has been uploaded to this repository for the sake of referece, the links to the main live dashboard and code will be updated accordingly when we have decided on a stable location and url for them.

### What remains to be done:
- Get the dashboard up and live.
- Fixes based on feedback and other adjustments to interactivity + UX.

I intend to continue being part of this open-source initiative and improving the dashboard.

### Challenges and Outcomes:
- The most challenging part of this project happened to be the physics part of things since that is not something I have studied or am familiar with. Professor Andy, my mentor, explained the workings wherever required and this proved very helpful.
- Learning about the physics related to my project and at the LHC in general quickly became my favourite part, and I want to continue understanding and working closely with this field.


Once again, Thank you Andy and Chris for your continued guidance and patience throughout this project!
