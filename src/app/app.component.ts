import { Component } from "@angular/core";
import * as htmlExample from "./shared/layouts/example";
import { HttpClient } from "@angular/common/http";
import * as FileSaver from "file-saver";
import { Observable } from "rxjs";
import { NgbTypeaheadConfig } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { DeepLinksData } from "./shared/data/deeplinks";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [NgbTypeaheadConfig]
})
export class AppComponent {
  tabDefault = { text: null, title: null };
  tabs = [];
  actualSlide = 0;
  options = {
    close: "yes",
    template: "sem",
    hideDownload: true,
    content: "slide"
  };
  content = null;
  Render = {
    buttonsType: "horizontal",
    buttons: []
  };
  urlDemo = "";
  constructor(private http: HttpClient, config: NgbTypeaheadConfig) {
    this.addTab();
    config.showHint = true;
  }

  getFile(filename: string) {
    return new Promise((resolve, reject) => {
      this.http.get(filename, { responseType: "text" }).subscribe(
        data => {
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  async render() {
    const { tabs, Render } = this;

    let render = {
      sections: "",
      stepBullet: "",
      buttons: ""
    };

    const moreThanOne = tabs.length > 1;
    const htmlCloseInapp =
      this.options.close == "yes"
        ? `<i href="adbinapp://cancel" class="inapp__close">fechar</i>`
        : ``;

    if(this.isContent('slide')) {
      for (let index in tabs) {
        const isActive = parseInt(index) == 0 ? " is-active" : "";
        let { img, text } = tabs[index];
        render.sections += htmlCloseInapp.concat(
          `<section class="step${isActive}"><img src="${img}" alt="${text}"></section>`
        );
        if (moreThanOne) {
          render.stepBullet += `<span class="step__bullet-dot${isActive}"></span>`;
        }
      }
    } else if(this.isContent('html')){
      render.sections = this.content;
    }


    for (let index in Render.buttons) {
      const { link, text, type, show } = Render.buttons[index];
      if (show == `yes`) {
        const btnColors = {
          primary: "",
          secundary: "btn-light",
          third: "btn-person"
        };
        const typeBtn = btnColors[type];
        const side = parseInt(index) != 0 ? "right" : "left";
        render.buttons += `<a href="${link}" role="button" title="${text}" class="btn ${typeBtn} col ${side}">${text}</a>`;
      }
    }

    const buttonPosition =
      Render.buttonsType != "horizontal" || this.options.template == "um"
        ? "two-btn"
        : "";
    const url = this.getGeneratedPageURL(
      render.sections,
      render.stepBullet,
      render.buttons,
      buttonPosition
    );

    this.urlDemo = this.actualSlide != 0 ? this.urlWithActualSlide(url) : url;
  }

  urlWithActualSlide(url) {
    return url
      .concat("#")
      .concat("slide=")
      .concat(this.actualSlide.toString());
  }

  getGeneratedPageURL = (sections, stepBullet, buttons, buttonPosition) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type: "text/html" });
      URL.revokeObjectURL;
      return URL.createObjectURL(blob);
    };

    const source = this.replaceCumulative(
      htmlExample.default.source,
      ["SECTIONS", "STEPBULLET", "BUTTONS", "TWOBTN"],
      [sections, stepBullet, buttons, buttonPosition]
    );

    return getBlobURL(source, "text/html");
  };

  addTab() {
    if (this.maxTabs()) {
      this.tabs.push({
        img: 'https://avatars1.githubusercontent.com/u/8322467',
        text: null,
        imgValid: false
      });
      this.render();
    }
  }

  moreOneTab() {
    return this.tabs.length > 1;
  }

  maxTabs() {
    return this.tabs.length < 8;
  }

  removeTab(index: any) {
    if (this.moreOneTab()) {
      this.tabs = this.tabs.filter((_, i) => i != index);
      this.render();
    }
  }

  async downloadHtml() {
    let html = null;

    await this.getFile(this.urlDemo)
      .then(result => (html = result))
      .catch(error => error);

    const now = this.getFormattedTime();

    FileSaver.saveAs(
      new File([html], "in-app-".concat(now).concat(".html"), {
        type: "text/html;charset=utf-8"
      })
    );
  }

  getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear().toString();
    var m = (today.getMonth() + 1).toString();
    var d = today.getDate().toString();
    var h = today.getHours().toString();
    var mi = today.getMinutes().toString();
    var s = today.getSeconds().toString();

    return y.concat(m.concat(d.concat(h.concat(mi.concat(s)))));
  }

  generateHTML() {}

  replaceCumulative(str, find, replace) {
    for (var i = 0; i < find.length; i++)
      str = str.replace(new RegExp(find[i], "g"), replace[i]);
    return str;
  }

  onTabChange($event) {
    if ($event.nextId == "add") {
      $event.preventDefault();
      this.addTab();
    } else {
      this.actualSlide = parseInt($event.nextId);
      this.render();
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 1
          ? []
          : DeepLinksData.filter(v =>
              v.name.toLowerCase().startsWith(term.toLocaleLowerCase())
            ).splice(0, 10)
      )
    );

  formatterDeepLink = (x: { name: string }) => x.name;

  selectedDeepLink($event, i) {
    this.unselectedDeepLink(i);
    const {
      item: { name, type, link }
    } = $event;
    const linkFormated = type.concat("://").concat(link);

    this.Render.buttons[i].label = name;
    this.Render.buttons[i].link = "adbinapp://confirm/?url=".concat(
      linkFormated
    );
    this.Render.buttons[i].selected = true;
    this.render();
  }

  unselectedDeepLink(i) {
    this.Render.buttons[i].selected = false;
    this.Render.buttons[i].link = "adbinapp://cancel";
    this.Render.buttons[i].label = null;
  }

  templateSelected() {
    const { template } = this.options;
    this.Render.buttons = [];
    const buttons = [
      {
        link: "adbinapp://cancel",
        text: "Exemplo 1",
        typeLink: "deepLink",
        type: "primary",
        show: "yes",
        label: null,
        selected: false
      },
      {
        link: "adbinapp://cancel",
        text: "Exemplo 2",
        typeLink: "deepLink",
        type: "secundary",
        show: "yes",
        label: null,
        selected: false
      }
    ];
    if (template == "dois") {
      this.Render.buttons = buttons;
    } else if (template == "um") {
      this.Render.buttons = [buttons[0]];
    } else if (template == "sem") {
      this.options.close == "yes";
      this.Render.buttons = [];
    }
    this.render();
  }

  haveButton() {
    const { template } = this.options;
    return template == "um" || template == "dois";
  }

  haveTwoButton() {
    return this.options.template == "dois";
  }

  async changeUrl(index) {
    const imgValid = await this.checkURLImage(this.tabs[index].img);
    this.tabs[index].imgValid = imgValid;
    this.options.hideDownload = !imgValid;
    this.render();
  }

  async checkURLImage(url) {
    let result = true;
    await this.testImage(url)
      .then(() => (result = false))
      .catch(() => (result = true));
    return result;
  }

  testImage(url, timeoutT = null) {
    return new Promise(function(resolve, reject) {
      var timeout = timeoutT || 5000;
      var timer,
        img = new Image();
      img.onerror = img.onabort = function() {
        clearTimeout(timer);
        reject("error");
      };
      img.onload = function() {
        clearTimeout(timer);
        resolve("success");
      };
      timer = setTimeout(function() {
        // reset .src to invalid URL so it stops previous
        // loading, but doens't trigger new load
        img.src = "//!!!!/noexist.jpg";
        reject("timeout");
      }, timeout);
      img.src = url;
    });
  }

  typeLinkIsDeepLink(i) {
    return this.Render.buttons[i].typeLink == "deepLink";
  }

  changeTypeLink(i) {
    this.Render.buttons[i].link = this.typeLinkIsDeepLink(i)
      ? "adbinapp://cancel"
      : "";
    this.render();
  }

  isContent(content: string) {
    return this.options.content === content;
  }
}
