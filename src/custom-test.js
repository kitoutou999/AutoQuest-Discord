(function() {
    'use strict';

    document.getElementById('custom-burger-menu')?.remove();
    document.getElementById('custom-dropdown-menu')?.remove();

    const BURGER_STYLE = {
        width: '24px',
        height: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: '1000',
        position: 'relative',
        margin: '2px',
        padding: '4px',
    };

    const LINE_STYLE = {
        width: '85%',
        height: '2px',
        backgroundColor: 'grey',
    };

    const MENU_STYLE = {
        position: 'fixed',
        backgroundColor: '#2f3136',
        border: '1px solid #202225',
        borderRadius: '8px',
        minWidth: '200px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)',
        display: 'none',
        flexDirection: 'column',
        zIndex: '999999',
        padding: '8px 0',
        transform: 'translateX(calc(-50% + 15px))',
    };

    const MENU_ITEM_STYLE = {
        padding: '10px 16px',
        cursor: 'pointer',
        color: '#dcddde',
        fontSize: '14px',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
        zIndex: '10000',
    };

    class BurgerMenu {
        constructor() {
            this.burger = null;
            this.menu = null;
            this.observer = null;
            this.retryCount = 0;
            this.maxRetries = 20;
            this.inserted = false;
        }

        executeQuestAutoComplete() {
            delete window.$;
            let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
            webpackChunkdiscord_app.pop();

            let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata).exports.Z;
            let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getRunningGames).exports.ZP;
            let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest).exports.Z;
            let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent).exports.Z;
            let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getSFWDefaultChannel).exports.ZP;
            let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue).exports.Z;
            let api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get).exports.tn;

            let quest = [...QuestsStore.quests.values()].find(x => x.id !== "1412491570820812933" && x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now())
            let isApp = typeof DiscordNative !== "undefined"
            if(!quest) {
                console.log("You don't have any uncompleted quests!")
            } else {
                const pid = Math.floor(Math.random() * 30000) + 1000
                
                const applicationId = quest.config.application.id
                const applicationName = quest.config.application.name
                const questName = quest.config.messages.questName
                const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2
                const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null)
                const secondsNeeded = taskConfig.tasks[taskName].target
                let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0

                if(taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                    const maxFuture = 10, speed = 7, interval = 1
                    const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime()
                    let completed = false
                    let fn = async () => {			
                        while(true) {
                            const maxAllowed = Math.floor((Date.now() - enrolledAt)/1000) + maxFuture
                            const diff = maxAllowed - secondsDone
                            const timestamp = secondsDone + speed
                            if(diff >= speed) {
                                const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}})
                                completed = res.body.completed_at != null
                                secondsDone = Math.min(secondsNeeded, timestamp)
                            }
                            
                            if(timestamp >= secondsNeeded) {
                                break
                            }
                            await new Promise(resolve => setTimeout(resolve, interval * 1000))
                        }
                        if(!completed) {
                            await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}})
                        }
                        console.log("Quest completed!")
                    }
                    fn()
                    console.log(`Spoofing video for ${questName}.`)
                } else if(taskName === "PLAY_ON_DESKTOP") {
                    if(!isApp) {
                        console.log("This no longer works in browser for non-video quests. Use the discord desktop app to complete the", questName, "quest!")
                    } else {
                        api.get({url: `/applications/public?application_ids=${applicationId}`}).then(res => {
                            const appData = res.body[0]
                            const exeName = appData.executables.find(x => x.os === "win32").name.replace(">","")
                            
                            const fakeGame = {
                                cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                                exeName,
                                exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                                hidden: false,
                                isLauncher: false,
                                id: applicationId,
                                name: appData.name,
                                pid: pid,
                                pidPath: [pid],
                                processName: appData.name,
                                start: Date.now(),
                            }
                            const realGames = RunningGameStore.getRunningGames()
                            const fakeGames = [fakeGame]
                            const realGetRunningGames = RunningGameStore.getRunningGames
                            const realGetGameForPID = RunningGameStore.getGameForPID
                            RunningGameStore.getRunningGames = () => fakeGames
                            RunningGameStore.getGameForPID = (pid) => fakeGames.find(x => x.pid === pid)
                            FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames})
                            
                            let fn = data => {
                                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value)
                                console.log(`Quest progress: ${progress}/${secondsNeeded}`)
                                
                                if(progress >= secondsNeeded) {
                                    console.log("Quest completed!")
                                    
                                    RunningGameStore.getRunningGames = realGetRunningGames
                                    RunningGameStore.getGameForPID = realGetGameForPID
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []})
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn)
                                }
                            }
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn)
                            
                            console.log(`Spoofed your game to ${applicationName}. Wait for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`)
                        })
                    }
                } else if(taskName === "STREAM_ON_DESKTOP") {
                    if(!isApp) {
                        console.log("This no longer works in browser for non-video quests. Use the discord desktop app to complete the", questName, "quest!")
                    } else {
                        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata
                        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
                            id: applicationId,
                            pid,
                            sourceName: null
                        })
                        
                        let fn = data => {
                            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value)
                            console.log(`Quest progress: ${progress}/${secondsNeeded}`)
                            
                            if(progress >= secondsNeeded) {
                                console.log("Quest completed!")
                                
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn)
                            }
                        }
                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn)
                        
                        console.log(`Spoofed your stream to ${applicationName}. Stream any window in vc for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`)
                        console.log("Remember that you need at least 1 other person to be in the vc!")
                    }
                } else if(taskName === "PLAY_ACTIVITY") {
                    const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id
                    const streamKey = `call:${channelId}:1`
                    
                    let fn = async () => {
                        console.log("Completing quest", questName, "-", quest.config.messages.questName)
                        
                        while(true) {
                            const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}})
                            const progress = res.body.progress.PLAY_ACTIVITY.value
                            console.log(`Quest progress: ${progress}/${secondsNeeded}`)
                            
                            await new Promise(resolve => setTimeout(resolve, 20 * 1000))
                            
                            if(progress >= secondsNeeded) {
                                await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}})
                                break
                            }
                        }
                        
                        console.log("Quest completed!")
                    }
                    fn()
                }
            }
        }

        createBurger() {
            const burger = document.createElement('div');
            burger.id = 'custom-burger-menu';
            Object.assign(burger.style, BURGER_STYLE);

            for (let i = 0; i < 3; i++) {
                const line = document.createElement('span');
                Object.assign(line.style, LINE_STYLE);
                burger.appendChild(line);
            }
            return burger;
        }

        createMenu() {
            const menu = document.createElement('div');
            menu.id = 'custom-dropdown-menu';
            Object.assign(menu.style, MENU_STYLE);

            const menuItems = [
                { label: 'Auto-Complétion Quête', action: 'questAutoComplete' }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.label;
                Object.assign(menuItem.style, MENU_ITEM_STYLE);

                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.backgroundColor = '#3c3f45';
                });
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.backgroundColor = 'transparent';
                });

                menuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.style.display = 'none';

                    if (item.action === 'questAutoComplete') {
                        this.executeQuestAutoComplete();
                    }
                });

                menu.appendChild(menuItem);
            });

            document.body.appendChild(menu);
            return menu;
        }

        attachBurgerEvents() {
            this.burger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = this.menu.style.display === 'flex';

                if (!isVisible) {
                    const rect = this.burger.getBoundingClientRect();
                    this.menu.style.top = `${rect.bottom + 4}px`;
                    this.menu.style.left = `${rect.left}px`;
                    this.menu.style.display = 'flex';
                } else {
                    this.menu.style.display = 'none';
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.burger.contains(e.target) && !this.menu.contains(e.target)) {
                    this.menu.style.display = 'none';
                }
            });
        }

        findTarget() {
            let container = document.querySelector('[class*="container__37e49"]');
            if (!container || container.offsetParent === null) {
                return null;
            }

            let elements = document.querySelectorAll('[class*="trailing_c38106"]');
            let target = elements[0];
            for (const el of elements) {
                if (el.offsetParent !== null) {
                    target = el;
                    return target;
                }
            }
            return null;
        }

        insert() {
            if (this.inserted || document.getElementById('custom-burger-menu')) {
                return true;
            }

            const target = this.findTarget();
            if (!target) {
                return false;
            }

            this.burger = this.createBurger();
            this.menu = this.createMenu();
            this.attachBurgerEvents();

            if (target.firstChild) {
                target.insertBefore(this.burger, target.firstChild);
            } else {
                target.appendChild(this.burger);
            }

            this.inserted = true;
            if (this.observer) {
                this.observer.disconnect();
            }
            return true;
        }

        tryInsert() {
            if (this.insert()) return true;
            this.retryCount++;
            if (this.retryCount < this.maxRetries) {
                setTimeout(() => this.tryInsert(), 1000);
                return false;
            }
            return false;
        }

        startObserver() {
            this.observer = new MutationObserver(() => {
                if (!this.inserted && !document.getElementById('custom-burger-menu')) {
                    this.insert();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.burgerMenu = new BurgerMenu();
    setTimeout(() => window.burgerMenu.tryInsert(), 2000);
    setTimeout(() => window.burgerMenu.startObserver(), 1000);
})();
