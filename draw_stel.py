import pyvista as pv
import numpy as np

def draw_stel(RBC, ZBS, NFP):
    nu, nv = 50, 80
    u = np.linspace(0, 2*np.pi, nu)
    v = np.linspace(0, 2*np.pi, nv)
    U, V = np.meshgrid(u, v, indexing="ij")

    #NFP = 2
    #nax = [-1, 0, 1]
    #max = [0, 1]

    #RBC[   0,    0] =    1.000000000000000e+00;      ZBS[   0,   0] =    1.000000000000000e+00
    #RBC[   1,    0] =    1.344559674021724e-01;      ZBS[   1,   0] =    1.328736337280527e-01
    #RBC[  -1,    1] =   -7.611873649087421e-02;      ZBS[  -1,   1] =    1.016005813066520e-01
    #RBC[   0,    1] =    1.663500817350330e-01;      ZBS[   0,   1] =    1.669633931562144e-01
    #RBC[   1,    1] =   -1.276344690455198e-02;      ZBS[   1,   1] =   -1.827419625823130e-02


    Z = np.zeros_like(U)
    R = np.zeros_like(U)

    #for n,m in RBC.keys():
    #try:
        #print(f"(n,m) RBC, ZBS: {n}, {m}, {RBC[n,m]}, {ZBS[n,m]}")
    #except:
        #print(f"bad string! {n}, {m}")
    #Z += ZBS[n,m]*np.sin(NFP*n*U + m*V)
    #R += RBC[n,m]*np.cos(NFP*n*U + m*V)

    # simple version w/ 2d arrays
    #for n in range(len(RBC)):
        #for m in range(len(RBC[0])):
            #R += RBC[n][m] * np.cos(NFP*n*U + m*V)
            #Z += ZBS[n][m] * np.sin(NFP*n*U + m*V)

    #changed back to dictionaries for parsing
    for key in RBC:
        n, m = key.split(',')
        n = int(n)
        m = int(m)
        R += RBC[key] * np.cos(NFP*n*U + m*V)
    
    # go through zbs dictionary
    for key in ZBS:
        n, m = key.split(',')
        n = int(n)
        m = int(m)
        Z += ZBS[key] * np.sin(NFP*n*U + m*V)

    X = R * np.cos(U)
    Y = R * np.sin(U)


    # Create StructuredGrid
    grid = pv.StructuredGrid(X, Y, Z)
    surface = grid.extract_surface()

    surface = surface.triangulate()

    plotter = pv.Plotter(off_screen=True)
    plotter.add_mesh(surface, smooth_shading=True)
    plotter.export_gltf("static/stellarator.glb")
    plotter.close()

    # Plot
    #grid.plot(show_edges=True)