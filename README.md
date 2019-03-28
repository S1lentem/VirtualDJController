# **Virtual DJ Controller**

## **Idea**

### *Description*

This project is a web-development of classic DJ controllers, with
ability to simultaneously play up to 4 audio tracks.
The interface of the controller itself can be divided into two main elements:

- ***Audio player***
- ***Mixer***

**Audio player** in the context of the controller can be duplicated up to 4 times (in classical controllers there are only 2) and is necessary for playing audio tracks, changing the speed, pitch and some effects (Reverb, delay, chorus, flanger).

**Mixer** is necessary for manipulating the volume and frequencies of certain audio tracks (Audio players connected to the corresponding channel of the mixer)

### *Analogs*

Among the existing counterparts can distinguish two main desktop software:
**[VirtualDJ](https://www.virtualdj.com/)** and **[Traktor](https://www.native-instruments.com/en/products/traktor/dj-software/traktor-dj-2/)**.

## **Implementation**
This project will be implemented using **[React](https://reactjs.org/)**. It may seem that ** React ** sishkom heavy for this idea, one in the future we plan to expand the functionality of the website (Add registration and logic on the back end).

The main tool for manipulating audio is **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**.
