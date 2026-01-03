# **Stellarator_Visualization**
Interactive web application for visualizing Fourier modes of 3D stellarator configurations

## **How to open the app:** ##
  1. Clone or download this repository
  2. Install Python dependencies:
       ```pip install flask pyvista numpy```
  3. Open a terminal in the project directory and run
       ```python app.py```
  4. In your web browser, open the link outputted by that command (e.g., http://127.0.0.1:5000)

## **Features:** ##
  ### 1. Inputting Fourier mode parameters ###
      - Load a stellarator configuration with preset parameters -- W7-X, QA (reactorscale), QH (reactorscale)
      - Directly copy and paste the entire text content of a VMEC file
      - Input custom values -- number of field periods (nfp), number of toroidal coordinates (n), and number of poloidal coordinates (m)
  <img width="1077" height="447" alt="Screenshot 2026-01-03 at 3 13 26 PM" src="https://github.com/user-attachments/assets/b1a103c9-5af7-4a5b-ac35-c879137db8bc" />
      
  ### 2. Visualizing the RBC (R Boundary Cosine) and ZBS (Z Boundary Sine) values in a table ###
  • Real-time color visualization of each table element to show comparative Fourier mode amplitudes
  
  • Color bar scaled logarithmically to emphasize variations on small magnitudes
  
  • Adjustable sliders for each RBC/ZBS value in the table, ranging from -15 to 15
  
  • Creates the corresponding table with dimensions according to preset/vmec file/custom input
  
  <img width="902" height="575" alt="Screenshot 2026-01-03 at 3 21 02 PM" src="https://github.com/user-attachments/assets/78898fd7-433c-419d-a938-5e06a856ef45" />
  
  ### 3. Generating the stellarator configuration ###
  • "generate plot" button updates the interactive stellarator model below with the corresponding RBC/ZBS values from the table
  
  • Zoom (pinch in/out with two fingers) and rotate (click and drag) functionalities
  
  <img width="443" height="484" alt="Screenshot 2026-01-03 at 3 36 30 PM" src="https://github.com/user-attachments/assets/2be63f80-6da6-41c7-af63-713333a78d1b" />


